

local isNuiOpen = false

function openFirefighterReport()
    if not isNuiOpen then
        SetNuiFocus(true, true)
        SendNUIMessage({
            action = 'openFirefighterReport'
        })
        print("Firefighter Report NUI opened")
        isNuiOpen = true
    else
        print("Firefighter Report NUI is already open")
    end
end


function closeFirefighterReport()
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'closeFirefighterReport'
    })
    print("Firefighter Report NUI closed")
    isNuiOpen = false
end

RegisterCommand('ffrunreport', function()
    print("firefighterreport command executed")
    openFirefighterReport()
end, false)

RegisterNUICallback('submitReport', function(data, cb)
    -- Send the data to the server
    TriggerServerEvent('firefighterReport:submitReport', data)
    -- Callback to NUI
    cb('ok')
    print("Firefighter Report submitted")
end)


RegisterNetEvent('firefighterReport:submissionResponse')
AddEventHandler('firefighterReport:submissionResponse', function(response)
    if response.success then
        closeFirefighterReport()
    else
        print("Error submitting report")
    end
end)

-- Callback to close the NUI from the NUI side
RegisterNUICallback('closeReport', function(_, cb)
    closeFirefighterReport()
    cb('ok')
    print("Firefighter Report NUI closed via NUI")
end)

-- Listen for the ESC key to close the NUI
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if isNuiOpen then
            if IsControlJustReleased(0, 322) then -- ESC key
                closeFirefighterReport()
            end
        end
    end
end)
