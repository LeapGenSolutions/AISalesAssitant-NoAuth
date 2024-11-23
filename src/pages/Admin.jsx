import React, { useEffect, useState, useContext, useCallback } from "react";
import { CosmosClient } from '@azure/cosmos';
import { AuthContext } from "../helpers/AuthContext";
import {
  FaRocket,
  FaTrash
} from "react-icons/fa";
import Customize from "../components/Customize";

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
  const [isLoading, setLoading] = useState(true);
  const { idTokenClaims } = useContext(AuthContext);
  const [newModelVersion, setNewModelVersion] = useState("");

  // Function to fetch versions from the Cosmos DB
  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const { resources } = await container.items.readAll().fetchAll();
      setModels(resources);
      const activeModel = resources.find((model) => model.active === 1);
      setSelectedModel(activeModel || resources[0] || null);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch versions on component mount
  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // Function to update the active version
  const updateActiveVersion = async () => {
    if (!selectedModel) return;

    setLoading(true);
    try {
      // Deactivate the current active version
      const currentActive = models.find((v) => v.active === 1);
      if (currentActive) {
        await container.item(currentActive.id, currentActive.versionNumber).replace({ ...currentActive, active: 0 });
      }

      // Activate the selected version
      await container.item(selectedModel.id, selectedModel.versionNumber).replace({ ...selectedModel, active: 1 });
      setSelectionMessage(`Selected model: ${selectedModel.versionNumber}`);
      setTimeout(() => setSelectionMessage(""), 2000);

      // Refresh the list after update
      fetchVersions();
    } catch (error) {
      console.error('Error updating active version:', error);
      setSelectionMessage('Failed to update active version');
      setTimeout(() => setSelectionMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSelectModel = (event) => {
    const modelValue = event.target.value;
    const changedModel = models.find((model) => model.versionNumber === modelValue);
    setSelectedModel(changedModel || null);
    console.log("Model selected:", changedModel);
  };

  const addModel = async () => {
    if (!newModelVersion.trim()) {
      setSelectionMessage('Please enter a valid model version');
      setTimeout(() => setSelectionMessage(""), 2000);
      return;
    }

    setLoading(true);
    try {
      const newModel = {
        id: `${models.length + 1}`, // Unique ID
        versionNumber: newModelVersion,
        active: 0, // Default to inactive
      };

      // Add to Cosmos DB
      await container.items.create(newModel);

      // Update the state with the new model
      setModels((prevModels) => [...prevModels, newModel]);
      setSelectionMessage(`Model ${newModelVersion} added successfully!`);
      setNewModelVersion(""); // Clear the input field
      setTimeout(() => setSelectionMessage(""), 2000);
    } catch (error) {
      console.error('Error adding model:', error);
      setSelectionMessage('Failed to add model');
      setTimeout(() => setSelectionMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (modelId, versionNumber) => {
    setLoading(true);
    try {
      // Delete the model from Cosmos DB
      await container.item(modelId, versionNumber).delete();

      // Update the state by filtering out the deleted model
      setModels((prevModels) => prevModels.filter((model) => model.id !== modelId));
      setSelectionMessage(`Model ${versionNumber} deleted successfully!`);
      setTimeout(() => setSelectionMessage(""), 2000);

      // If the deleted model was the selected one, reset the selected model
      if (selectedModel?.id === modelId) {
        setSelectedModel(null);
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      setSelectionMessage("Failed to delete model");
      setTimeout(() => setSelectionMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full p-4 items-center">
      <h2 className="text-3xl text-white font-bold my-4">
        Welcome to Admin Portal - {idTokenClaims?.name}
      </h2>
      {selectionMessage && (
        <div className="mt-2 text-green-500 text-sm font-semibold">{selectionMessage}</div>
      )}

      {activeTab === "Representation" && (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center space-y-6 p-8 bg-white bg-opacity-20 rounded-lg shadow-xl">
            <h1 className="text-4xl font-extrabold sm:text-5xl"><FaRocket className="w-10 h-10" /> Coming Soon</h1>
            <p className="text-lg sm:text-xl font-medium">We are working hard on something amazing.</p>
            <p className="text-md sm:text-lg">Stay tuned for updates!</p>
          </div>
        </div>
      )}

      {activeTab === "Configuration" && (
        <>
          <div className="flex w-full p-6 items-start justify-around items-stretch">
            {/* Left: Selected Model */}
            <div className="w-1/2 flex flex-col items-center pr-4 border-r">

              <h3 className="text-2xl text-white font-semibold mb-4">Model Configuration</h3>
              <div className="w-full mb-4">
                <label className="text-white font-semibold">Change Model:</label>
                <select
                  value={selectedModel?.versionNumber || ""}
                  onChange={handleChangeSelectModel}
                  className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.versionNumber}>
                      {model.versionNumber}
                    </option>
                  ))}
                </select>

              </div>
              <button onClick={updateActiveVersion} className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full">
                Update Model
              </button>
            </div>

            {/* Right: Model List */}
            <div className="w-1/2 pl-4">
              <h3 className="text-2xl text-white font-semibold mb-4">Available Versions</h3>
              <ul className="bg-gray-800 p-4 rounded-lg shadow-md">
                {models.map((model) => (
                  <li key={model.id} className="flex justify-between items-center mb-2">
                    <span className="text-white">{model.versionNumber}</span>
                    {model.active === 1 && (
                      <button className="bg-green-500 text-white p-1 rounded-lg text-sm">Active</button>
                    )}
                    <button
                      onClick={() => deleteModel(model.id, model.versionNumber)}
                      className="bg-red-500 text-white p-2 rounded-lg text-sm"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex w-full p-6 items-start justify-around items-stretch">
            {/* Left: Selected Model */}
            <div className="w-1/2 flex flex-col items-center pr-4 ">
              <h3 className="text-2xl text-white font-semibold mb-4">Add Model</h3>
              <div className="w-full mb-4">
                <label className="text-white font-semibold">New Model Version:</label>
                <input
                  type="text"
                  value={newModelVersion}
                  onChange={(e) => setNewModelVersion(e.target.value)}
                  className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
                  placeholder="Enter model version"
                />
              </div>
              <button onClick={addModel} className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full">
                Add Model
              </button>
            </div>
          </div>
        </>
      )}
      {activeTab === "Customize" && (
        <Customize />
      )}
    </div>
  );
}

export default Admin;