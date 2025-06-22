const conntoken="90934559|-31949210113790181|90959057";
const empdbname="SCHOOL-DB";
const dbrel="STUDENT-TABLE";
const jpdbbaseurl="http://api.login2explore.com:5577";
const jpdbiml="/api/iml";
const jpdbirl="/api/irl";

function getStudentByID(){
    const rollNo= JSON.stringify($('#rollNo').val());
    const getrequest=createGet_BY_KEYRequest(conntoken,empdbname,dbrel,rollNo);
    jQuery.ajaxSetup({async:false});
    const resjsonobject= executeCommandAtGivenBaseUrl(getrequest,jpdbbaseurl,jpdbirl);
    jQuery.ajaxSetup({async:true});
    console.log('Full response object:', resjsonobject);
    console.log('Response status:', resjsonobject.status);
    console.log('Response data:', resjsonobject.data);
    
    if(resjsonobject.status==400){
        alert("Student not found");
        $('#saveBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#rollNo').focus();
    }
    else if(resjsonobject.status==200){
        alert("Student found");
        const dataobject=JSON.parse(resjsonobject.data);
        localStorage.setItem("recordnumber",dataobject.rec_no);
        
        console.log('Record data:', dataobject.record);
        fillremainform(dataobject.record);
        
        // Enable form fields for editing
        $('#fullName').prop('disabled', false);
        $('#className').prop('disabled', false);
        $('#birthDate').prop('disabled', false);
        $('#address').prop('disabled', false);
        $('#enrollmentDate').prop('disabled', false);
        
        $('#changeBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#rollNo').focus();
    }
}

function resetform(){
    $('#rollNo').val('');
    $('#fullName').val('');
    $('#className').val('');
    $('#birthDate').val('');
    $('#address').val('');
    $('#enrollmentDate').val('');
    $('#rollNo').prop('disabled', false);
    $('#saveBtn').prop('disabled', true);
    $('#changeBtn').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);
    $('#rollNo').focus();
}

function saveStudent(){
    const jsonstrobj=validateData();
    if(jsonstrobj===''){
        return;
    }
    const putrequest=createPUTRequest(conntoken ,jsonstrobj,empdbname,dbrel);
    jQuery.ajaxSetup({async:false});
    const resjsonobject= executeCommandAtGivenBaseUrl(putrequest,jpdbbaseurl,jpdbiml) 
    jQuery.ajaxSetup({async:true});
    resetform();
    alert("Student saved successfully");
    $('#rollNo').focus();
}

function validateData(){
    const rollNo= $('#rollNo').val();
    const fullName= $('#fullName').val();
    const className= $('#className').val();
    const birthDate= $('#birthDate').val();
    const address= $('#address').val();
    const enrollmentDate= $('#enrollmentDate').val();
    if(rollNo===''){
        alert("Roll No is required");
        $('#rollNo').focus();
        return '';
    }
    if(fullName===''){
        alert("Full Name is required");
        $('#fullName').focus();
        return '';
    }
    if(className===''){
        alert("Class is required");
        $('#className').focus();
        return '';
    }
    if(birthDate===''){
        alert("Birth Date is required");
        $('#birthDate').focus();
        return '';
    }
    if(address===''){
        alert("Address is required");
        $('#address').focus();
        return '';
    }
    if(enrollmentDate===''){
        alert("Enrollment Date is required");
        $('#enrollmentDate').focus();
        return '';
    }
    const jsonstrobj={
        "rollNo":rollNo,
        "fullName":fullName,
        "className":className,
        "birthDate":birthDate,
        "address":address,
        "enrollmentDate":enrollmentDate
    }
    return JSON.stringify(jsonstrobj);
}

function updateStudent(){
    const jsonstrobj=validateData();
    if(jsonstrobj===''){
        return;
    }
    
    const recordNumber = localStorage.getItem("recordnumber");
    if (!recordNumber) {
        alert("No record selected for update. Please search for a student first.");
        return;
    }
    
    console.log('Updating record number:', recordNumber);
    console.log('Update data:', jsonstrobj);
    
    const updaterequest=createUpdateRecordRequest(conntoken, jsonstrobj, empdbname, dbrel, recordNumber);
    console.log('Update request:', updaterequest);
    
    jQuery.ajaxSetup({async:false});
    const resjsonobject= executeCommandAtGivenBaseUrl(updaterequest,jpdbbaseurl,jpdbiml) 
    jQuery.ajaxSetup({async:true});
    console.log('Update response:', resjsonobject);
    
    if (resjsonobject.status === 200) {
        alert("Student updated successfully");
        resetform();
    } else {
        alert("Error updating student: " + (resjsonobject.message || 'Unknown error'));
    }
}

function createPUTRequest(conntoken, jsonstrobj, empdbname, dbrel) {
    var putRequest = "{\n" +
      "\"token\" : \"" + conntoken + "\",\n" +
      "\"dbName\": \"" + empdbname + "\",\n" +
      "\"cmd\" : \"PUT\",\n" +
    "\"rel\" : \"" + dbrel + "\",\n" +
      "\"jsonStr\": " + jsonstrobj + "\n" +
      "}";
    return putRequest;
  }

  function createUpdateRecordRequest(conntoken, jsonstrobj, empdbname, dbrel, recno) {
    // Parse the JSON string to get the student data
    const studentData = JSON.parse(jsonstrobj);
    
    // Create the update structure with record number as key
    const updateData = {
        [recno]: studentData
    };
    
    var updateRequest = "{\n" +
      "\"token\" : \"" + conntoken + "\",\n" +
      "\"dbName\": \"" + empdbname + "\",\n" +
      "\"cmd\" : \"UPDATE\",\n" +
      "\"rel\" : \"" + dbrel + "\",\n" +
      "\"jsonStr\": " + JSON.stringify(updateData) + "\n" +
      "}";
    return updateRequest;
  }

  function createGet_BY_KEYRequest(conntoken, empdbname, dbrel, rollNo) {
    var getRequest = "{\n" +
      "\"token\" : \"" + conntoken + "\",\n" +
      "\"dbName\": \"" + empdbname + "\",\n" +
      "\"cmd\" : \"GET_BY_KEY\",\n" +
    "\"rel\" : \"" + dbrel + "\",\n" +
    "\"createTime\": true,\n" +
    "\"updateTime\": true,\n" +
    "\"jsonStr\": {\n" +
    "\"rollNo\": " + rollNo + "\n" +
    "}\n" +
      "}";
    return getRequest;
  }

const fillremainform=(record)=>{
    $('#fullName').val(record.fullName);
    $('#className').val(record.className);
    $('#birthDate').val(record.birthDate);
    $('#address').val(record.address);
    $('#enrollmentDate').val(record.enrollmentDate);
}