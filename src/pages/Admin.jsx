import React, { useEffect, useState } from "react";
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.REACT_APP_COSMOS_DB_URI,
  key: process.env.REACT_APP_COSMOS_DB_PRIMARY_KEY,
});

const database = client.database('cosmosdb-db-gy4phravzt2ak');
const container = database.container('VersionsContainer');

function Admin({ activeTab }) {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectionMessage, setSelectionMessage] = useState("");
  const loadingState = useState(true); // Add loading state
  const setLoading = loadingState[1]; // Add loading state

  const updateActiveVersion = async () => {
    try {
      // Step 1: Deactivate the current active version (check if it exists)
      const currentActive = models.find(v => v.active === 1);
      if (currentActive) {
        await container.item(currentActive.id, currentActive.versionNumber).replace({ ...currentActive, active: 0 });
      }
  
      // Step 2: Activate the selected version (ensure the selected version exists)
      const newActiveVersionId = selectedModel.versionNumber
      const newActiveVersion = models.find(v => v.versionNumber === newActiveVersionId);
      if (newActiveVersion) {
        await container.item(newActiveVersion.id, newActiveVersion.versionNumber).replace({ ...newActiveVersion, active: 1 });
        setSelectionMessage(`Selected model: ${newActiveVersionId}`);
        setTimeout(() => setSelectionMessage(""), 2000); // Clear message after 2 seconds
        // Refresh the list after update
        fetchVersions();
      } else {
        console.error('New active version not found');
      }
    } catch (error) {
      console.error('Error updating active version:', error);
      setSelectionMessage('Failed to update active version');
      setTimeout(() => setSelectionMessage(""), 3000); // Show error message for 3 seconds
    }
  };

  const fetchVersions = async () => {
    try {
      const { resources } = await container.items.readAll().fetchAll();
      setModels(resources);
      setLoading(false);
      resources.map(model => {
        if (model.active) {
          setSelectedModel(model)
        }
        return model
      })

    } catch (error) {
      console.error('Error fetching versions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  });


  const handleChangeSelectModel = (event) => {
    const modelValue = event.target.value;
    setSelectedModel(()=>models.filter((model)=>model.versionNumber===modelValue)[0]);
    
  };

  if(!selectedModel) 
    return <div>Loading</div>
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
                value={selectedModel && selectedModel.versionNumber}
                onChange={(e)=>handleChangeSelectModel(e)}
                className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
              >
                {models.map((model, index) => (
                  <option key={index} value={model.versionNumber}>
                    {model.versionNumber}
                  </option>
                ))}
              </select>
              {selectionMessage && (
                <div className="mt-2 text-green-500 text-sm font-semibold">
                  {selectionMessage}
                </div>
              )}
            </div>

            <button
              onClick={updateActiveVersion}
              className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full"
            >
              Update Model
            </button>
          </div>

          {/* Right: Model List */}
          <div className="w-1/2 pl-4">
            <h3 className="text-2xl text-white font-semibold mb-4">Available Versions</h3>
            <ul className="bg-gray-800 p-4 rounded-lg shadow-md">
              {models.map((model, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="text-white">{model.versionNumber}</span>
                  {model.active===1 && <button
                    className="bg-green-500 text-white p-1 rounded-lg text-sm"
                  >
                    Active
                  </button>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
