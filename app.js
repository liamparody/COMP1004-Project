//when the page loads the loadLocalStorage() function is called to load any saved data from local storage
document.addEventListener("DOMContentLoaded", function(){     
    loadLocalStorage();                                   
})
//creates an empty array called JSONData to be filled by the program later
var JSONData = []; 
//function to load each page, depending on what is put in the brackets depends on what page is loaded
function showContent(pageID){ 
    //finds all of the content classes and sets them to invisible
    document.querySelectorAll('.content').forEach(function(div){ 
        div.style.display = 'none';
    });
    //uses the value placed in the brackets of the function and finds any element with that name, and sets those elements to visible
    document.getElementById(pageID).style.display = 'block'; 
};
//function to load the local JSON file when uploaded and upload button is clicked
function loadJSON(){ 
    //gets the element where the JSON file is being stored
    const JSONfile = document.getElementById("JSONFile");
    //gets the first file only from where the JSON file is stored
    const file = JSONfile.files[0]; 
    //creates a new filereader to read the JSON file
    const reader = new FileReader();
    //when reader is loaded a new function is created and called to read and parse the JSON file and then write the data to the JSONData array
    reader.onload = function(read){
        const fileResult = JSON.parse(read.target.result);
        for (let a = 0; a < fileResult.length; a++){
            JSONData[a] = fileResult[a]; 
        }
        //calls the fillTable() function to fill the tables and pushes the value of JSONData to the function
        fillTable(JSONData); 
        //gets the JSONLoadedText element and sets the text to show that the file has been loaded
        const loadedText = document.getElementById("JSONLoadedText");
        loadedText.innerText = "JSON File Successfully Loaded"
        
    };
    reader.readAsText(file);
};

//function to save stored data to localstorage
function saveLocalStorage(){
    //creates a new const which stores a JSON string version of the array JSONData
    const JSONStore = JSON.stringify(JSONData);
    //pushes the data to localstorage under the name JSONLocalStorage
    localStorage.setItem("JSONLocalStorage", JSONStore);
}
//function to load data from localstorage
function loadLocalStorage(){
    //gets the data stored in localstorage under the name JSONLocalStorage and stores it in a const
    const loadedLocalStorage = localStorage.getItem("JSONLocalStorage");
    //checks to see if localstorage has a value, and if it does it parses the data and stores it in the array JSONData, and then fills the tables
    if (loadedLocalStorage){
        JSONData = JSON.parse(loadedLocalStorage);
        fillTable(JSONData);
    }
}
//function to fill the database tables with the data from the JSONData array, it accepts JSONData and a role which determines what data
//is loaded
function fillTable(JSONData, role){
    //gets the element of the tbody of the table and stores it in a const
    const table = document.getElementById("mainTable").getElementsByTagName("tbody")[0]
    //makes the table empty to ensure nothing is added more than once
    table.innerHTML = "";
    //a loop to go through all of JSONData and add it to the table one by one
    for (let n = 0; n < JSONData.length; n++){
        //checks if the role of the record is the same as the one specified if one is specified and then runs the code, if no role is
        //specified the entire JSONData array data will be added to the table, skip is used to push the skip value to the studentSelect()
        //function which is used to fill the calculator dropdown boxes and is used to skip the function if called upon
        if(JSONData[n].role == role || role == undefined || role == "skip"){
        //creates a let to allow for new rows to be added to the table when called upon
        let rowFill = table.insertRow();
        //creates a let for the id row, adding a new cell on the row and then filling it with the appropriate data
        let fillID = rowFill.insertCell(0);
        fillID.textContent = JSONData[n].id;
        //used to fill the name row
        let fillName = rowFill.insertCell(1);
        fillName.textContent = JSONData[n].name; 
        //used to fill the age row
        let fillAge = rowFill.insertCell(2);
        fillAge.textContent = JSONData[n].age;
        //used to fill the role row
        let fillRole = rowFill.insertCell(3);
        fillRole.textContent = JSONData[n].role;
        //used to fill the classes row, it changes the html of this row to add a dropdown box which is then filled dynamically with
        //the corresponding data compared to the JSONData array data and adds an onchange function to call the updateGradeFillTable()
        //function
        let fillClasses = rowFill.insertCell(4);
        fillClasses.innerHTML = `<form>
        <select id="classview${n}" onchange="updateGradeFillTable(${n})">
        <option>View enrolled classes</option>
        </select>
        </form>`
        //checks if the record has any classes saved to it, and if it does it then 
        if (JSONData[n].classes){
            //loop to go through all the classes and add them to the dropdown box
            for(let y = 0; y < JSONData[n].classes.length; y++){
               //gets the element classview[n] to be able to add data to it later
               let classViewDropbox = document.getElementById(`classview${n}`);
               //creates a new element (option) to add options to the dropdown box
               const addClassOption = document.createElement("option"); 
               //makes the text and value of the new option the value of the subject of this record
               addClassOption.text = JSONData[n].classes[y].subject;
               addClassOption.value = JSONData[n].classes[y].subject;
               //adds the created option to the dropdown box
               classViewDropbox.appendChild(addClassOption);
            }
        }
        //used to fill the grade row, creates an empty div with an id to be filled in the updategradefilltable() function
        let fillGrade = rowFill.insertCell(5);
        fillGrade.innerHTML = `<div id="gradeView${n}"></div>`;
        }
        
    }
    //calls these functions to fill the edit table, the calculator student dropdown box and save the data to localstorage
    fillEditTable(JSONData);
    studentSelect(role);
    saveLocalStorage();
}



//function to fill the edit table using the JSONData array data
function fillEditTable(JSONData){
    //gets the edit table´s tbody element and stores it in a const
    const editTable = document.getElementById("editTable").getElementsByTagName("tbody")[0];
    //clears the edittables html to ensure that there are no repeat entries
    editTable.innerHTML = "";
    //loop to fill the table with all of the data from JSONData array
    for (let n = 0; n < JSONData.length; n++){
        //creates a let which when called upon adds a new row to the table
        let editRow = editTable.insertRow();
        //inserts a new cell to the row for the id input field, and adds new html with the data from the JSONData array and adds a unique id
        let editID = editRow.insertCell(0);
        editID.innerHTML = `<input type="number" value="${JSONData[n].id}" id="id${n}">`;
        //inserts new cell to row for the name input/edit section
        let editName = editRow.insertCell(1);
        editName.innerHTML = `<input type="text" value="${JSONData[n].name}" id="name${n}">`;
        //inserts new cell to row for the age input/edit section
        let editAge = editRow.insertCell(2);
        editAge.innerHTML = `<input type="number" value="${JSONData[n].age}" id="age${n}">`;
        //inserts new cell to row for the role input/edit section and adds a dropdown box with the options student and teacher
        //there are two options so that the correct role is automatically selected depending on what role is stored for that record 
        //in the JSONData array
        let editRole = editRow.insertCell(3);
        if (JSONData[n].role == "Student"){
            editRole.innerHTML = `<form>
                                  <select id="role${n}">
                                  <option>Student</option>
                                  <option>Teacher</option>
                                  </select>
                                  </form>`
        }
        else{
            editRole.innerHTML = `<form>
                                  <select id="role${n}">
                                  <option>Teacher</option>
                                  <option>Student</option>
                                  </select>
                                  </form>`
                                  
        }
        //inserts new cell to row for the classes input/edit section and adds two dropdown boxes, the first one is empty except for the
        //current option, this dropdown is then dynamically updated later to include all of the classes the person is enrolled in, the 
        //second dropdown is filled with all possible class options, then two buttons are added, the add and delete button, these are 
        //used to add and delete classes by calling upon their respective functions when clicked
        let editClasses = editRow.insertCell(4);
        editClasses.innerHTML =`<form>
        <select id="class${n}" onchange="updateGradeEditTable(${n})">
        <option>Current</option>
        </select>
        <select id="addClass${n}">
        <option>All</option>
        <option>Maths</option>
        <option>English</option>
        <option>Science</option>
        <option>History</option>
        <option>Art</option>
        <option>Spanish</option>
        <option>Music</option>
        <option>IT</option>
        <option>PE</option>
        </select>
            
        <button class="btn btn-primary" onclick="deleteClass(${n})">Delete</button>
        <button class="btn btn-primary" onclick="addClass(${n})">Add</button>
        </form>`
        //checks to see if the data for this record has any classes saved, and if so runs the next code
        if (JSONData[n].classes){
            //runs loop to fill in the current dropbox with the valid JSONData array data
            for(let y = 0; y < JSONData[n].classes.length; y++){
                //gets the class dropdown element to use to fill with the array data
                let classEditDropbox = document.getElementById(`class${n}`);
                //creates a new option element to fill into the dropdown later
                const addEditClassOption = document.createElement("option"); 
                //sets the text and value of the new option element with the correct data from the JSONData array
                addEditClassOption.text = JSONData[n].classes[y].subject;
                addEditClassOption.value = JSONData[n].classes[y].subject;
                //adds the new complete option to the dropdown
                classEditDropbox.appendChild(addEditClassOption);
            }
        }
        //inserts new cell to row for the grade input/edit section with no value, this value is added by the updategradeedittable()
        //function which is called when a class is selected by the user in the current class dropdown, however if the record is that
        //of a teacher the input box will be invisible as teachers cannot have grades
        let editGrade = editRow.insertCell(5);
        if (JSONData[n].role == "Student"){
            editGrade.innerHTML = `<input type="number" id="grade${n}">`;
        }
        else{
            editGrade.innerHTML = `<input type="number" id="grade${n}" style="display: none;">`
        }
        //inserts new cell to row for the delete button which is used to delete individual records, when clicked the deleterecord()
        //function is called and the number of n is sent so that the correct record can be deleted
        let deleteButton = editRow.insertCell(6);
        deleteButton.innerHTML = `<button class="btn btn-primary btn-lg py-3" onclick="deleteRecord(${n})">Delete</button>`;
    }
    
}
//function to change the grade being viewed and potentially edited depending on which class is selected
function updateGradeEditTable(ID){
    //gets the class element and uses the id sent to the function to get the correct class element, this is used to see what
    //option has been selected by the user
    const classEditDropdownOption = document.getElementById(`class${ID}`);
    //gets the grade element input box to be written/rewritten into later
    const emptyGradeInput = document.getElementById(`grade${ID}`);
    //checks to see if the current option on the dropdown is selected and clears the grade box and ends the function
    if (classEditDropdownOption.value == "Current"){
        emptyGradeInput.value = ""
        return;
    }
    //loops through the classes until a match between the class dropdown option and the data stored in the correct JSONData record
    //for example dropdown = math JSONData = math and then sets the grade stored in that JSONData.classes record to the grade input/edit box
    for (let a = 0; a < JSONData[ID].classes.length; a++){
        if (JSONData[ID].classes[a].subject == classEditDropdownOption.value){
            emptyGradeInput.value = JSONData[ID].classes[a].grade;
        }
    }
}
//function to delete classes from records
function deleteClass(ID){
    //gets the element of the current class box and then gets the value of what is selected
    const recordClass = document.getElementById(`class${ID}`);
    const recordClassValue = recordClass.value;
    //loop to go through the JSONData array in the classes section to find the record matching the value in the class dropdown
    //for example math = math and then once found it deletes that class from that record from JSONData and then refills the tables
    //with the updated data
    for (let x = 0; x < JSONData[ID].classes.length; x++){
        if (JSONData[ID].classes[x].subject == recordClassValue){
            JSONData[ID].classes.splice(x, 1);
            fillTable(JSONData);
        }
    }
}
//function to add classes to records
function addClass(ID){
    //gets the element of the addclass dropdown and then gets and stores its value to see what option the user has chosen from the all box
    const recordClassAdd = document.getElementById(`addClass${ID}`);
    const recordClassAddValue =recordClassAdd.value;
    //checks to see if the record already has a classes part of the JSONData array and if so runs the next code
    if (JSONData[ID].classes){
        //loop to go through the JSONData.classes array and find a match with the chosen option by the user in the all dropdown box,
        //if a match is found an error is thrown to the user and the function is terminated
        for (let g = 0; g < JSONData[ID].classes.length; g++){
            if (JSONData[ID].classes[g].subject == recordClassAddValue){
                alert ("This record already has this class added");
                return;
            }
        }
    }
    //checks to see if the user has left the all dropdown box selecting the option all, and throws an error if so
    if (recordClassAddValue == "All"){
        alert ("Please select a class to add")
        return;
    }
    //checks to see if there is a classes section in the array for this record and if not creates one
    if (!JSONData[ID].classes){
        JSONData[ID].classes = [];
    }
    //adds the class selected by the user to the correct record in the array and adds an empty grade section so that grades can
    //be added to this class later
    JSONData[ID].classes.push({subject: recordClassAddValue, grade:""});
    //refills the tables with the updated data from the JSONData array
    saveEdits();
    fillTable(JSONData);
    showContent("editor");
}

//function to save edits made by the user
function saveEdits(){
    const tableUpdated = document.getElementById("editTable").getElementsByTagName("tbody")[0];
    //creates a counter which is set to how many records are stored in the JSONData array
    let counter = JSONData.length;
    //checks to see if there are less records stored in JSONData than how many rows on the edit table and if so adds a new
    //record to the array with empty data fields to be filled in later and then increments the counter by one, this is in case
    //a new row has been added by the user
    while (counter < tableUpdated.rows.length){
        JSONData.push({
            id: "",
            name: "",
            age: "",
            role: "",
            classes: []
        });
        counter++;
        
    }
    //goes through all of the rows of the edit table and saves their values to the JSONData array
    for (let b = 0; b < tableUpdated.rows.length; b++){
        //updates id data in array
        let idUpdate = document.getElementById(`id${b}`).value;
        JSONData[b].id = idUpdate;
        //updates name data in array
        let nameUpdate = document.getElementById(`name${b}`).value;
        JSONData[b].name = nameUpdate;
        //updates age data in array
        let ageUpdate = document.getElementById(`age${b}`).value;
        JSONData[b].age = ageUpdate;
        //updates role data in array
        let roleUpdate = document.getElementById(`role${b}`).value;
        JSONData[b].role = roleUpdate;
        //updates grade data by getting the value of the selected class and the entered grade in their respective input boxes and then
        //updates them to the JSONData array
        let gradeUpdate = document.getElementById(`grade${b}`).value;
        let classValue = document.getElementById(`class${b}`).value;
        for (let y = 0; y < JSONData[b].classes.length; y++){
            if (classValue == JSONData[b].classes[y].subject){
                JSONData[b].classes[y].grade = gradeUpdate
            }
        }
    }
    //fills the table and then returns back to the database page from the edit page
    fillTable(JSONData);
    showContent("database")
    
}
//creates a global variable called rowcounter which is used to count what the current amount of rows there are
var rowCounter
//function to add new rows in the edit table which can then be saved to the JSONData array
function addRow(){
    
    const editTableAdd = document.getElementById("editTable").getElementsByTagName("tbody")[0];
    //sets the rowcounter variable to the amount of rows there currently are in the edit table
    rowCounter = editTableAdd.rows.length;
    //creates a let which when called upon creates a new row on the edit table
    let editRowAdd = editTableAdd.insertRow();
    //adds a new cell for adding a new ID to the new row, the cell contains an empty input field with a unique id
    let addID = editRowAdd.insertCell(0);
    addID.innerHTML = `<input type="number" value="" id="id${rowCounter}">`;
    //adds a new cell for adding a new name to the new row
    let addName = editRowAdd.insertCell(1);
    addName.innerHTML = `<input type="text" value="" id="name${rowCounter}">`;
    //adds a new cell for adding a new age to the new row
    let addAge = editRowAdd.insertCell(2);
    addAge.innerHTML = `<input type="number" value="" id="age${rowCounter}">`;
    //adds a new cell for adding a new grade to the new row
    let addGrade = editRowAdd.insertCell(3);
    addGrade.innerHTML = `<input type="number" value="" id="grade${rowCounter}">`;
    //adds a new cell for adding a new role to the new row and creates a new dropdown box with the options student and teacher
    let addRole = editRowAdd.insertCell(4);
    addRole.innerHTML = `<form>
                         <select id="role${rowCounter}">
                         <option>Student</option>
                         <option>Teacher</option>
                         </select>
                         </form>`
    //adds a new cell for adding a new class to the new row and creates two dropdown boxes, the first one being the current classes
    //box, which is mostly empty and will be dynamically filled later, and the second dropdown which is the all classes dropdown, this
    //box contains all of the classes that can be added to the record, and then two buttons are also added, the addclass and deleteclass
    //buttons which when clicked either add or delete a selected class by calling upon their respective functions
    let addClasses = editRowAdd.insertCell(5);
    addClasses.innerHTML = `<form>
    <select id="class${rowCounter}">
    <option>Current</option>
    </select>
    <select id="addClass${rowCounter}">
    <option>All</option>
    <option>Maths</option>
    <option>English</option>
    <option>Science</option>
    <option>History</option>
    <option>Art</option>
    <option>Spanish</option>
    <option>Music</option>
    <option>IT</option>
    <option>PE</option>
    </select>
    
    <button class="btn btn-primary" onclick="deleteClass(${rowCounter})">Delete</button>
    <button class="btn btn-primary" onclick="addClass(${rowCounter})">Add</button>
    </form>`
    //adds a new cell which contains a delete button which can be used to delete the new row if the user wishes by calling upin the 
    //deleterecord() function
    let addDeleteButton = editRowAdd.insertCell(6);
    addDeleteButton.innerHTML = `<button class="btn btn-primary btn-lg py-3" onclick="deleteRecord(${rowCounter})">Delete</button>`;
    //increments the counter so that the loop knows whether or not to repeat
    rowCounter++;
    //saves the edits and goes back to the editor page as the saveedits() function sends the user back to the database page
    saveEdits();
    showContent('editor')
}
//function to save the data stored in JSONData as a local .JSON file
function saveJSON() {
    //makes the JSONData array a JSON string so that it can be downloaded and stores it in a const
    const JSONString = JSON.stringify(JSONData);
    //creates a new blob with the JSONString data of type JSON, which can be used to help download the .JSON file later
    const JSONBlob = new Blob([JSONString], {type: 'application/JSON'});
    //creates a new "a" element which is used to download the file later
    const JSONLink = document.createElement("a");
    //sets the href of the of the anchor element to a url which contains the JSONBlob data
    JSONLink.href = URL.createObjectURL(JSONBlob);
    //sets the name of the file to be downloaded
    JSONLink.download = "Bayside.json";
    //clicks on the link set earlier to begin downloading it
    JSONLink.click();
    
}
//function used to delete records from the edit table and the JSONData array
function deleteRecord(recordID){
    const tableDeleteRow = document.getElementById("editTable").getElementsByTagName("tbody")[0];
    //deletes the row associated with the recordID sent when the function was called 
    tableDeleteRow.deleteRow(recordID);
    //deletes the record associated with the recordID sent when calling the function from the JSONData array
    JSONData.splice(recordID, 1);
    //refills the database table with the updated data
    fillTable(JSONData); 
}
//function to calculate grades, pass/fail and update records when a student and class are selected by the user
// when using the calculator page, this is called when the calculate button is pressed
function calculateGrades(){ 
    //gets the values of all three input boxes on the calculator page along with the elements for the empty result and passfail box
    let studentMarks = document.getElementById("studentMarks").value;
    let totalMarks = document.getElementById("totalMarks").value;
    let minPass = document.getElementById("passPercentage").value;
    let resultMarks = document.getElementById("result");
    let passFail = document.getElementById("passFail");
    //sets the text of these boxes as empty so that there are no clashes
    resultMarks.innerText = "";
    passFail.innerText = ""
    //makes the numbers entered by the user of type float, so that there are no rounding errors as no decimals are not allowed as this
    //calculator is for marks and marks cant be percentages, if a decimal is entered an error is thrown later
    studentMarks = parseFloat(studentMarks);
    totalMarks = parseFloat(totalMarks);
    minPass = parseFloat(minPass);
    
    //checks to see if the studentmarks and totalmarks boxes are filled and with numbers if not throws an error and terminates 
    //the function, note that the minpass box is not checked, this is because the minpass box is an optional box and therefore can be empty
    if (isNaN(studentMarks) || isNaN(totalMarks)){
        alert("Please fill both input boxes with valid numbers before calculating");
        return;
    }
    //checks if both studentmarks or totalmarks are numbers above zero and throws an error if not and terminates function
    if (studentMarks < 0 || totalMarks < 0){
        alert("Numbers entered must be positive");
        return;
    }
    //checks if totalmarks is at least one and throws an error if not and terminates function, this is because an exam must have at least one question
    if (totalMarks < 1){
        alert("Total Marks must be at least 1");
        return;
    }
    //checks to see if both studentmarks or totalmarks are integer numbers and if not throws an error and terminates function
    if (!Number.isInteger(studentMarks) || !Number.isInteger(totalMarks)){
        alert("Please enter whole numbers only")
        return;
    }
    //checks to see if student marks is less than totalmarks and throws an error and terminates function if so as you cant get more marks than the total amount of marks
    if (studentMarks > totalMarks){
        alert("Total Marks must be higher or equal to the Student Marks");
        return;
    } 
    else{
        //does the maths to work out the grade percentage and stores it
        let result = (studentMarks / totalMarks) * 100;
        //sets the result to two decimal places
        result = result.toFixed(2);
        //parses the result as a float number
        result = parseFloat(result);
        //sets the result in the result box for the user to see and adds a percentage sign after it
        resultMarks.innerText = result + "%";
        //gets the elements of the studentselect dropdown and the classselect dropdown to see what their value is later
        const studentSelectDropdown = document.getElementById("studentSelect");
        const classSelectDropdown = document.getElementById("classSelect");
        //checks to see if a student has been set in the studentselect box by making sure that the no student option isnt selected
        if(studentSelectDropdown.value !== "No Student"){
            //loop to go through all of the records to locate the correct one as selected by the user in the studentselect dropdown
            for (let i = 0; i < JSONData.length; i++){
                //checks to see if the dropdown value is the same as the current records name value and if so proceeds with the next line of code
                if (studentSelectDropdown.value == JSONData[i].name){
                    //loop to find the correct class within the classes section on the JSONData array
                    for (let k = 0; k < JSONData[i].classes.length; k++){
                        //compares the class dropdown boxes value with the JSONData.classes subject data and when the correct one is
                        //located the code continues with the next lines
                        if (classSelectDropdown.value == JSONData[i].classes[k].subject){
                            //parses the float number to a JSON string to be stored in the JSONData array
                            stringResult = JSON.stringify(result)
                            //sets the correct value in the correct place within the array
                            JSONData[i].classes[k].grade = stringResult;
                            //refills the database table with the correct updated data and uses the skip role which will skip the studentselect()
                            //function to prevent the dropdown boxes on the calculator page from resetting, making it less annoying to use
                            fillTable(JSONData, "skip");
                        }
                    }       
                }
            }
        }
        //checks to see if the minpass input field is empty and if so terminates the function
        if (isNaN(minPass)){
            return;
        }
        //if the minpass box has a value entered then it will check whether the value entered is between 0 and 100 as percentages must
        //be between those two numbers and if above or below throws and error and terminates the function
        else{ 
            if(minPass > 100  || minPass < 0){
                alert("Min Pass value must be between 0 and 100");
                return;
            }
            //checks to see if the minimum pass value is above the calculated result and if so fills the passfail box on the calculator 
            //page with the word fail, alerting them that the student has failed
            if(minPass > result){
                passFail.innerText = "Fail";
            
        }
        //if the above requirement wasnt met then the passfail box is filled with the word pass, alerting the user that the student has passed
        else{
            passFail.innerText = "Pass";
        }
        }
    } 
}
//function used to fill the student dropdown box on the calculator page with only students stored in the database
function studentSelect(skip){
    //checks to see if the function has been called with the skip condition set and if so skips the function
    if(skip !== "skip"){
        //gets the element of the studentselect dropdown box to fill it up later 
        const emptyDropdown = document.getElementById("studentSelect")
        //empties the html of the studentselect dropdown so that no repeats or clashes occur
        emptyDropdown.innerHTML = ""
        //creates a new option element which will be used to add an option to the dropdown
        const addOption = document.createElement("option"); 
        //sets the value and text of the option to No Student, this option is used when the user doesnt want to set the grade to any student
        addOption.text = "No Student";
        addOption.value = "No Student";
        //adds the updated option element to the studentselect dropdown
        emptyDropdown.appendChild(addOption);
        //loop to go through all of the JSONData array and add the appropriate data to the dropdown
        for (let d = 0; d < JSONData.length; d++){
            //checks to see if the role of the current record is student and then runs the rest of the code if so, this is because
            //teachers cannot have grades assigned to them
            if (JSONData[d].role == "Student"){ 
                //creates a new option element 
                const addOption = document.createElement("option");
                //sets the text and value of the new option element to the correct JSONData.name value
                addOption.text = JSONData[d].name;
                addOption.value = JSONData[d].name;
                //adds the new updated option element to the studentselect dropdown
                emptyDropdown.appendChild(addOption);
            }
        }
    }
}
//function to fill the class dropdown depending on which student is selected in the calculator page
function fillClassDropdown(){
    //gets and stores the option selected by the user in the studentselect dropdown box
    const nameChoice = document.getElementById("studentSelect").value;
    //gets the element of the classselect dropdown box and sets its html to empty
    const emptyClassDropdown = document.getElementById("classSelect");
    emptyClassDropdown.innerHTML = "";
    //checks to if the studentselect dropdown choice is no student and if so terminates the function
    if (nameChoice == "No Student"){
        return;
    }
    //loop to go through the JSONData array and find the matching name with the one in the studentselect dropdown
    for (let e = 0; e < JSONData.length; e++){
        //compares the current JSONData.name with the one in the studentselect dropdown and when a match is found continues
        if (JSONData[e].name == nameChoice){
            //loop to go through each of the classes records and add them to the classselect dropdown
            for (let j = 0; j < JSONData[e].classes.length; j++){
                //creates a new option element to be added later to the classselect dropdown
                const addClassDropdownOption = document.createElement("option");
                //sets the text and value of the new option element to the correct JSONData.classes data
                addClassDropdownOption.text = JSONData[e].classes[j].subject;
                addClassDropdownOption.value = JSONData[e].classes[j].subject;
                //adds the new updated option element to the classselect dropdown
                emptyClassDropdown.appendChild(addClassDropdownOption);
            }
            
        }
    }
    
  

}
//function to update the grade on the filltable depending on which class is selected, this is called upon when the class dropdown box option is changed
function updateGradeFillTable(ID){
    //gets the correct gradeview and classview elements using the ID sent when calling the function
    const gradeOutputText = document.getElementById(`gradeView${ID}`);
    const gradeClassOption = document.getElementById(`classview${ID}`);
    //checks to see if the classview dropdown selection is view enrolled classes and if so sets the text to blank as no class has been selected and terminates the function
    if (gradeClassOption.value == "View enrolled classes"){
        gradeOutputText.innerText = ""
        return;
    }
    //loop to go through the classes section of the JSONData array and find the correct subject in comparison with the classview box value
    for (let s = 0; s < JSONData[ID].classes.length; s++){
        //compares the subject value of the JSONData.classes array with the selected value in the classview dropdown and when a match is found continues
        if (gradeClassOption.value == JSONData[ID].classes[s].subject){
            //checks to see if any grade has already been set for this class and if not outputs the text no grade set
            if (!JSONData[ID].classes[s].grade){
                gradeOutputText.innerText = "No Grade Set"
            }
            //if a grade has been set already in JSONData then the correct JSONData arrays grade will be outputted to the gradeview box
            else{
            gradeOutputText.innerText = JSONData[ID].classes[s].grade;
            }
        }
    }
}






       
        
        
    

