
RegisterServerEvent('firefighterReport:submitReport')
AddEventHandler('firefighterReport:submitReport', function(data)

    print(json.encode(data))


    local webhookUrl = ""  -- Replace with your actual Discord webhook URL

    local embed = {
        {
            title = "Firefighter Run Report Submitted",
            description = "A new firefighter run report has been submitted.",
            fields = {
                { name = "Date", value = data.date, inline = true },
                { name = "Incident Number", value = data.incidentNumber, inline = true },
                { name = "Incident Type", value = data.incidentType, inline = true },
                { name = "Location", value = data.location, inline = true },
                { name = "Alarm", value = data.alarm, inline = true },
                { name = "Dispatch", value = data.dispatch, inline = true },
                { name = "Vehicles", value = formatVehicles(data.vehicles), inline = false },
                { name = "Fire Apparatus Used", value = formatApparatus(data.apparatus), inline = false },
                { name = "Agencies Involved", value = table.concat(data.agencies, ", "), inline = false },
                { name = "Narrative", value = data.narrative, inline = false }
            },
            color = 16711680 -- Red color
        }
    }
    sendWebhook(webhookUrl, embed)

    TriggerClientEvent('firefighterReport:submissionResponse', source, { success = true })
end)

function formatVehicles(vehicles)
    local formattedVehicles = {}
    for i, vehicle in ipairs(vehicles) do
        table.insert(formattedVehicles, string.format("**Vehicle %d**\nDriver: %s\nRiders: %s\nEnroute: %s\nOn Scene: %s\nClear: %s", 
            i, vehicle.driver, vehicle.riders, vehicle.enroute, vehicle.onscene, vehicle.clear))
    end
    return table.concat(formattedVehicles, "\n\n")
end

function formatApparatus(apparatus)
    local formattedApparatus = {}
    for i, app in ipairs(apparatus) do
        table.insert(formattedApparatus, string.format("**Apparatus %d**\nType: %s\nOperator: %s\nEnroute: %s\nOn Scene: %s\nClear: %s", 
            i, app.type, app.operator, app.enroute, app.onscene, app.clear))
    end
    return table.concat(formattedApparatus, "\n\n")
end

function sendWebhook(url, embed)
    local payload = {
        username = "Firefighter Report Bot",
        embeds = embed
    }

    PerformHttpRequest(url, function(err, text, headers) 
        if err ~= 200 then
            print("Error sending webhook: "..err)
        end
    end, 'POST', json.encode(payload), { ['Content-Type'] = 'application/json' })
end
