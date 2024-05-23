let vehicleCount = 0;
let apparatusCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    const incidentNumberInput = document.getElementById('incident-number');
    if (incidentNumberInput) {
        incidentNumberInput.value = generateIncidentNumber();
    } else {
        console.error('Incident Number input is missing');
    }

    document.getElementById('add-vehicle').addEventListener('click', () => {
        vehicleCount++;
        const vehicleDiv = document.createElement('div');
        vehicleDiv.classList.add('vehicle');
        vehicleDiv.innerHTML = `
            <h3>Vehicle ${vehicleCount}</h3>
            <div class="form-group">
                <label for="vehicle${vehicleCount}-driver">Driver:</label>
                <input type="text" id="vehicle${vehicleCount}-driver">
            </div>
            <div class="form-group">
                <label for="vehicle${vehicleCount}-riders">Riders:</label>
                <input type="text" id="vehicle${vehicleCount}-riders">
            </div>
            <div class="form-group">
                <label for="vehicle${vehicleCount}-enroute">Enroute Time:</label>
                <input type="time" id="vehicle${vehicleCount}-enroute">
            </div>
            <div class="form-group">
                <label for="vehicle${vehicleCount}-onscene">On Scene Time:</label>
                <input type="time" id="vehicle${vehicleCount}-onscene">
            </div>
            <div class="form-group">
                <label for="vehicle${vehicleCount}-clear">Clear Time:</label>
                <input type="time" id="vehicle${vehicleCount}-clear">
            </div>
        `;
        document.getElementById('vehicles').appendChild(vehicleDiv);
    });

    document.getElementById('add-apparatus').addEventListener('click', () => {
        apparatusCount++;
        const apparatusDiv = document.createElement('div');
        apparatusDiv.classList.add('apparatus');
        apparatusDiv.innerHTML = `
            <h3>Apparatus ${apparatusCount}</h3>
            <div class="form-group">
                <label for="apparatus${apparatusCount}-type">Type:</label>
                <input type="text" id="apparatus${apparatusCount}-type">
            </div>
            <div class="form-group">
                <label for="apparatus${apparatusCount}-operator">Operator:</label>
                <input type="text" id="apparatus${apparatusCount}-operator">
            </div>
            <div class="form-group">
                <label for="apparatus${apparatusCount}-enroute">Enroute Time:</label>
                <input type="time" id="apparatus${apparatusCount}-enroute">
            </div>
            <div class="form-group">
                <label for="apparatus${apparatusCount}-onscene">On Scene Time:</label>
                <input type="time" id="apparatus${apparatusCount}-onscene">
            </div>
            <div class="form-group">
                <label for="apparatus${apparatusCount}-clear">Clear Time:</label>
                <input type="time" id="apparatus${apparatusCount}-clear">
            </div>
        `;
        document.getElementById('apparatus').appendChild(apparatusDiv);
    });

    document.getElementById('submit').addEventListener('click', () => {
        const dateInput = document.getElementById('date');
        const incidentNumber = document.getElementById('incident-number');
        const incidentType = document.getElementById('incident-type');
        const location = document.getElementById('location');
        const alarm = document.getElementById('alarm');
        const dispatch = document.getElementById('dispatch');
        const narrative = document.getElementById('narrative');

        if (!dateInput || !incidentNumber || !incidentType || !location || !alarm || !dispatch || !narrative) {
            console.error('One or more form inputs are missing');
            return;
        }

        const data = {
            date: dateInput.value,
            incidentNumber: incidentNumber.value,
            incidentType: incidentType.value,
            location: location.value,
            alarm: alarm.value,
            dispatch: dispatch.value,
            vehicles: getVehicleData(),
            apparatus: getApparatusData(),
            agencies: getAgenciesInvolved(),
            narrative: narrative.value
        };

        console.log("Submitting Firefighter Report", data);

        fetch(`https://${GetParentResourceName()}/submitReport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                
                closeFirefighterReport();
            } else {
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        console.log("Closing Firefighter Report NUI");
        closeFirefighterReport();
    });
});

function generateIncidentNumber() {
    return 'INC' + Math.floor(Math.random() * 100000);
}

function getVehicleData() {
    const vehicles = [];
    for (let i = 1; i <= vehicleCount; i++) {
        const driver = document.getElementById(`vehicle${i}-driver`);
        const riders = document.getElementById(`vehicle${i}-riders`);
        const enroute = document.getElementById(`vehicle${i}-enroute`);
        const onscene = document.getElementById(`vehicle${i}-onscene`);
        const clear = document.getElementById(`vehicle${i}-clear`);

        if (driver && riders && enroute && onscene && clear) {
            vehicles.push({
                driver: driver.value,
                riders: riders.value,
                enroute: enroute.value,
                onscene: onscene.value,
                clear: clear.value
            });
        } else {
            console.error(`Vehicle ${i} inputs are missing`);
        }
    }
    return vehicles;
}

function getApparatusData() {
    const apparatus = [];
    for (let i = 1; i <= apparatusCount; i++) {
        const type = document.getElementById(`apparatus${i}-type`);
        const operator = document.getElementById(`apparatus${i}-operator`);
        const enroute = document.getElementById(`apparatus${i}-enroute`);
        const onscene = document.getElementById(`apparatus${i}-onscene`);
        const clear = document.getElementById(`apparatus${i}-clear`);

        if (type && operator && enroute && onscene && clear) {
            apparatus.push({
                type: type.value,
                operator: operator.value,
                enroute: enroute.value,
                onscene: onscene.value,
                clear: clear.value
            });
        } else {
            console.error(`Apparatus ${i} inputs are missing`);
        }
    }
    return apparatus;
}

function getAgenciesInvolved() {
    const agencies = [];
    if (document.getElementById('bcso').checked) agencies.push('BCSO');
    if (document.getElementById('spd').checked) agencies.push('SPD');
    if (document.getElementById('bcfd').checked) agencies.push('BCFD');
    if (document.getElementById('dnr').checked) agencies.push('DNR');
    if (document.getElementById('asp').checked) agencies.push('ASP');
    return agencies;
}

function closeFirefighterReport() {
    fetch(`https://${GetParentResourceName()}/closeReport`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        document.querySelector('.tab-container').style.display = 'none';
    }).catch(error => {
        console.error('Error:', error);
    });
}
