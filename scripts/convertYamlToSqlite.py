#!/usr/bin/env python3
"""
Convert Kannada dictionary from YAML to SQLite database
Usage: python convertYamlToSqlite.py input.yaml output.db
"""

import sqlite3
import yaml
import sys
import os

def create_dictionary_db(yaml_file_path, db_path):
    """Convert YAML dictionary to SQLite database"""
    
    print(f"Loading YAML file: {yaml_file_path}")
    
    # Load YAML data
    try:
        with open(yaml_file_path, 'r', encoding='utf-8') as file:
            dictionary_data = yaml.safe_load(file)
    except FileNotFoundError:
        print(f"Error: YAML file '{yaml_file_path}' not found")
        return False
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}")
        return False
    
    print(f"Loaded {len(dictionary_data)} dictionary entries")
    
    # Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
    
    # Create SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables with proper schema
    cursor.execute('''
        CREATE TABLE dictionary (
            id INTEGER PRIMARY KEY,
            head TEXT,
            entry TEXT NOT NULL,
            phone TEXT,
            origin TEXT,
            info TEXT,
            UNIQUE(entry, phone)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE definitions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dictionary_id INTEGER,
            def_id INTEGER,
            entry TEXT NOT NULL,
            type TEXT,
            FOREIGN KEY (dictionary_id) REFERENCES dictionary (id)
        )
    ''')
    
    # Create indexes for fast lookups
    cursor.execute('CREATE INDEX idx_entry ON dictionary (entry)')
    cursor.execute('CREATE INDEX idx_entry_collate ON dictionary (entry COLLATE NOCASE)')
    cursor.execute('CREATE INDEX idx_phone ON dictionary (phone)')
    cursor.execute('CREATE INDEX idx_dict_id ON definitions (dictionary_id)')
    cursor.execute('CREATE INDEX idx_def_type ON definitions (type)')
    
    # Create full-text search index for definitions
    cursor.execute('''
        CREATE VIRTUAL TABLE definitions_fts USING fts5(
            dictionary_id,
            entry,
            type,
            content='definitions',
            content_rowid='id'
        )
    ''')
    
    # Insert data
    inserted_count = 0
    skipped_count = 0
    
    for item in dictionary_data:
        try:
            # Insert dictionary entry (handle duplicates)
            cursor.execute('''
                INSERT OR IGNORE INTO dictionary (id, head, entry, phone, origin, info)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                item.get('id', 0),
                item.get('head', ''),
                item.get('entry', ''),
                item.get('phone', ''),
                item.get('origin', ''),
                item.get('info', '')
            ))
            
            # Get the actual inserted/existing dictionary ID
            cursor.execute('SELECT id FROM dictionary WHERE entry = ? AND phone = ?', 
                         (item.get('entry', ''), item.get('phone', '')))
            dict_result = cursor.fetchone()
            
            if dict_result:
                dict_id = dict_result[0]
                
                # Insert definitions
                definitions = item.get('defs', [])
                for definition in definitions:
                    cursor.execute('''
                        INSERT INTO definitions (dictionary_id, def_id, entry, type)
                        VALUES (?, ?, ?, ?)
                    ''', (
                        dict_id,
                        definition.get('id', 0),
                        definition.get('entry', ''),
                        definition.get('type', '')
                    ))
                
                inserted_count += 1
            else:
                skipped_count += 1
                
        except sqlite3.Error as e:
            print(f"Error inserting item {item.get('id', 'unknown')}: {e}")
            skipped_count += 1
            continue
    
    # Populate FTS index
    cursor.execute('INSERT INTO definitions_fts SELECT dictionary_id, entry, type FROM definitions')
    
    # Create summary statistics
    cursor.execute('SELECT COUNT(*) FROM dictionary')
    total_words = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM definitions')
    total_definitions = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(DISTINCT type) FROM definitions WHERE type != ""')
    total_types = cursor.fetchone()[0]
    
    # Commit and close
    conn.commit()
    conn.close()
    
    print(f"\n✅ Database created successfully: {db_path}")
    print(f"📊 Statistics:")
    print(f"   - Total words: {total_words:,}")
    print(f"   - Total definitions: {total_definitions:,}")
    print(f"   - Word types: {total_types}")
    print(f"   - Inserted: {inserted_count:,}")
    print(f"   - Skipped: {skipped_count:,}")
    print(f"   - Database size: {os.path.getsize(db_path) / (1024*1024):.2f} MB")
    
    return True

def main():
    if len(sys.argv) != 3:
        print("Usage: python convertYamlToSqlite.py <input.yaml> <output.db>")
        print("Example: python convertYamlToSqlite.py kannada_dictionary.yaml public/kannada-dictionary.db")
        sys.exit(1)
    
    yaml_file = sys.argv[1]
    db_file = sys.argv[2]
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(db_file) if os.path.dirname(db_file) else '.', exist_ok=True)
    
    success = create_dictionary_db(yaml_file, db_file)
    
    if success:
        print(f"\n🎉 Conversion completed! Database ready for use.")
        print(f"📁 Database location: {os.path.abspath(db_file)}")
    else:
        print("❌ Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()