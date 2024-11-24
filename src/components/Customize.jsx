import { CosmosClient } from "@azure/cosmos";
import React, { useCallback, useEffect, useState } from "react";

const Customize = () => {
    const [customizations, setCustomizations] = useState(null);
    const [selectedCusotmization, setSelectedCusotmization] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [multiTenantChecked, setMultiTenantChecked] = useState(false)

    const client = new CosmosClient({
        endpoint: process.env.REACT_APP_COSMOS_DB_URI,
        key: process.env.REACT_APP_COSMOS_DB_PRIMARY_KEY,
    });
    const database = client.database('cosmosdb-db-gy4phravzt2ak');
    const container = database.container('customizationId');


    const fetchCustomization = useCallback(async () => {
        setLoading(true);
        try {
            const { resources } = await container.items.readAll().fetchAll();
            setCustomizations(()=>[{displayName:"--None--"},...resources]);        
        } catch (error) {
            console.error('Error fetching versions:', error);
        } finally {
            setLoading(false);
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckChange = (event)=>{
        setMultiTenantChecked(event.target.checked);        
    }

    const handleChangeSelectCustomization = (event)=>{
        const customization = customizations.find(v=>v.displayName===event.target.value);
        setSelectedCusotmization(customization)
        setMultiTenantChecked(customization.multiTenant)
    }
    console.log(selectedCusotmization);
    
    const updateCustomization = async() =>{
        setLoading(true)
        try {
            // Deactivate the current active version
            
            const currentActive = selectedCusotmization;
            if (currentActive) {
              await container.item(currentActive.id, currentActive.customizationKey).replace({ ...currentActive, multiTenant: multiTenantChecked });
            }
      
            // Activate the selected version
            fetchCustomization()
          } catch (error) {
            console.error('Error updating active version:', error);
          } finally {
            setLoading(false);
          }
    }
    
    useEffect(()=>{
        fetchCustomization()
    },[fetchCustomization])

    if (isLoading) {
        return null
    }
    return <>
        <div className="flex w-full p-6 items-start justify-around items-stretch">
            {/* Left: Selected Model */}
            <div className="w-1/2 flex flex-col items-center pr-4 border-r">

                <h3 className="text-2xl text-white font-semibold mb-4">User Confguration</h3>
                <div className="w-full mb-4">
                    <label className="text-white font-semibold">Select User:</label>
                    <select
                        value={(selectedCusotmization && selectedCusotmization?.displayName) || "--None--"}
                        onChange={handleChangeSelectCustomization}
                        className="bg-[#FFF39F] text-black p-2 rounded-lg mt-2 w-full"
                    >
                        {customizations.map((customization) => (
                            <option key={customization.id} value={customization.displayName}>
                                {customization.displayName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right: Model List */}
            <div className="w-1/2 pl-4">
                <h3 className="text-2xl text-white font-semibold mb-4">Customizations</h3>
                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox" onChange={handleCheckChange} value={multiTenantChecked} checked={multiTenantChecked}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label className="text-white font-semibold ml-2">Multi-Tenant</label>
                </div>
            </div>
        </div>
        <button 
        onClick={updateCustomization} 
        className="bg-[#FFF39F] text-black p-2 rounded-lg mt-4">
            Update Customization
        </button>
        <hr className="w-full h-1 my-8 border-0 rounded" style={{ backgroundColor: '#FFF39F' }} />
        <div className="bg-gray-800 mt-5 rounded-lg shadow-lg p-6 w-80">
            <h2
                className="text-center text-lg font-semibold"
                style={{ color: '#FFF39F' }}
            >
                User Details
            </h2>
            <div className="mt-4">
                <div className="mb-3 flex justify-start items-center">
                    <p className="text-sm text-while-400" style={{ color: 'white' }}>Name:</p>
                    <p className="text-base font-medium ml-4" style={{ color: '#FFF39F' }}>
                        {selectedCusotmization?.displayName}
                    </p>
                </div>
                <div className="mb-3 flex justify-start items-center">
                    <p className="text-sm text-while-400" style={{ color: 'white' }}>Email:</p>
                    <p className="text-base font-medium ml-4" style={{ color: '#FFF39F' }}>
                        {selectedCusotmization?.customizationKey}
                    </p>
                </div>
                <div className="mb-3 flex justify-start items-center">
                    <p className="text-sm text-while-400" style={{ color: 'white' }}>Role:</p>
                    <p className="text-base font-medium ml-5" style={{ color: '#FFF39F' }}>
                    {selectedCusotmization?.role}
                    </p>
                </div>
            </div>
        </div>
    </>
}

export default Customize