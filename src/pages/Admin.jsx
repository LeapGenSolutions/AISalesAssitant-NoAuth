import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../helpers/AuthContext";
import {
  FaRocket,
  FaTrash
} from "react-icons/fa";
import {
  fetchVersions,
  addVersion,
  deleteVersion,
  activateVersion,
} from "../helpers/VersionAPI";


function Admin({ activeTab }) {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectionMessage, setSelectionMessage] = useState("");
  const [isLoading, setLoading] = useState(true);
  const { idTokenClaims } = useContext(AuthContext);
  const [newModelVersion, setNewModelVersion] = useState("");

  useEffect(() => {
    loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const loadVersions = useCallback(async () => {
    try {
      const { data } = await fetchVersions();
      setModels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  },[]);

  const handleAddVersion = async () => {
    if (!newModelVersion.trim()) return;
    try {
      await addVersion(newModelVersion);
      await loadVersions()
      setSelectionMessage("Model added successfully");
      setTimeout(() => setSelectionMessage(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVersion = async (id, version) => {
    try {
      await deleteVersion(id, version);
      setModels(models.filter((m) => m.id !== id));
      await loadVersions()
    } catch (err) {
      console.error(err);
    }
  };
  // Function to update the active version
  const handleActivateVersion = async () => {
    if (!selectedModel) return;
    setLoading(true);
    try{
      await activateVersion(selectedModel.id, selectedModel.versionNumber);
      await loadVersions()
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
              <div className="w-full mb-4">
                <label class="inline-flex items-center cursor-pointer" >
                <input type="checkbox" value="" class="sr-only peer"/>
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-white">Multi-Turn</span>
                </label>
              </div>
              <button onClick={handleActivateVersion} className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full">
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
                      onClick={() => handleDeleteVersion(model.id, model.versionNumber)}
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
              <button onClick={handleAddVersion} className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4 w-full">
                Add Model
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;