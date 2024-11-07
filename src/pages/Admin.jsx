import React, { useState } from "react";

function Admin({ activeTab }) {
  const [models, setModels] = useState(["Model 1", "Model 2", "Model 3"]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [newModelName, setNewModelName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [selectionMessage, setSelectionMessage] = useState("");

  const handleAddModel = () => {
    if (newModelName.trim()) {
      setModels([...models, newModelName]);
      setNewModelName("");
      setShowAddInput(false);
    }
  };

  const handleDeleteModel = (modelToDelete) => {
    setModels(models.filter((model) => model !== modelToDelete));
    if (modelToDelete === selectedModel && models.length > 1) {
      setSelectedModel(models[0]);
    }
  };

  const handleSelectModel = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    setSelectionMessage(`Selected model: ${model}`);
    setTimeout(() => setSelectionMessage(""), 2000); // Clear message after 2 seconds
  };

  return (
    <div className="flex flex-col w-full p-4 items-center">
      <h2 className="text-3xl text-white font-bold my-4">
        Welcome to Admin Portal - Ron Rogers
      </h2>

      {activeTab === "Representation" && (
        <iframe
          title="admin-iframe"
          src="https://www.google.com/"
          className="w-full h-full m-4 rounded"
        />
      )}

      {activeTab === "Configuration" && (
        <div className="flex w-full p-6 items-start justify-around items-stretch">
          {/* Left: Selected Model */}
          <div className="w-1/2 flex flex-col items-center pr-4 border-r">
            <h3 className="text-2xl text-white font-semibold mb-4">
              Model Configuration
            </h3>
            <div className="w-full mb-4">
              <label className="text-white font-semibold">Change Model:</label>
              <select
                value={selectedModel}
                onChange={handleSelectModel}
                className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
              >
                {models.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {selectionMessage && (
                <div className="mt-2 text-green-500 text-sm font-semibold">
                  {selectionMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right: Model List */}
          <div className="w-1/2 pl-4">
            <h3 className="text-2xl text-white font-semibold mb-4">Models</h3>
            <ul className="bg-gray-800 p-4 rounded-lg shadow-md">
              {models.map((model, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="text-white">{model}</span>
                  <button
                    onClick={() => handleDeleteModel(model)}
                    className="bg-red-500 text-white p-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowAddInput(true)}
              className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full"
            >
              Add New Model
            </button>
            {showAddInput && (
              <div className="mt-2">
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="bg-white p-2 rounded-lg w-full mt-2"
                  placeholder="Enter model name"
                />
                <button
                  onClick={handleAddModel}
                  className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
                >
                  Confirm Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
