import React, { useState } from 'react';
import { Upload, FileText, Clipboard } from 'lucide-react';

const TextInput = ({ onTextSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('paste');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onTextSubmit(inputText.trim());
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setInputText(text);
        onTextSubmit(text);
      };
      reader.readAsText(file);
    }
  };

  const sampleText = `ಒಂದು ಕಾಲದಲ್ಲಿ ಒಂದು ಊರಲ್ಲಿ ಒಬ್ಬ ರಾಜನಿದ್ದನು. ಅವನು ತುಂಬಾ ದಯಾಳು ಮತ್ತು ನ್ಯಾಯಪ್ರಿಯನಾಗಿದ್ದನು. ಪ್ರಜೆಗಳು ಅವನನ್ನು ತುಂಬಾ ಪ್ರೀತಿಸುತ್ತಿದ್ದರು.`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add Your Kannada Text
      </h2>
      
      <div className="flex space-x-1 mb-4">
        <button
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'paste'
              ? 'bg-kannada-orange text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('paste')}
        >
          <Clipboard className="inline-block w-4 h-4 mr-2" />
          Paste Text
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-kannada-orange text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          Upload File
        </button>
      </div>

      {activeTab === 'paste' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-kannada-orange focus:outline-none kannada-text text-lg resize-none"
              placeholder="ನಿಮ್ಮ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setInputText(sampleText)}
              className="btn-secondary text-sm"
            >
              Try Sample Text
            </button>
            
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Reading
            </button>
          </div>
        </form>
      )}

      {activeTab === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label className="btn-primary cursor-pointer">
              Choose File (.txt)
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Upload a .txt file containing Kannada text
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInput;