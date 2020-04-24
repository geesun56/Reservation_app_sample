const address = 'http://127.0.0.1:3000/'


function signIn(){
    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    const type  = 'addUser/'
    const user = document.querySelector("#user_signin").value;
    
    if(user.length == 0){return alert("Error: type correct user name.")}
    request.open("POST", address+type+user, true); 
    console.log(`Client> Sign-In request sent.`);

    request.onload = function() {
        
        server_res = this.response;
        
        if (request.status == 200) {
            
            console.log(server_res);
            alert("New user successfully added.");
        }
        else if(request.status == 400){
            alert('Error: User already exists.')
        }
        else{
            alert(server_res);
            console.log(`Error occured. Status : ${request.status}`)
        }
    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function checkReserv(){
    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    const type  = 'getReservationInfo/'
    const user = document.querySelector("#user_signin").value;
    
    if(user.length == 0){return alert("Error: type correct user name.")}
    request.open("GET", address+type+user, true); 
    console.log(`Client> Reservation Info request sent.`);

    request.onload = function() {
        
        server_res = this.response;
        
        if (request.status == 200) {

            const reserv = JSON.parse(server_res)
            let msg = '<h3>Reservation INFO of ' +reserv.User +'</h3>'+ 'User: '+ reserv.User +'</br>'+ 'Date: '+reserv.Date+'</br>'+'Time: '+reserv.Time+'</br>'+'Hours:'+reserv.Hours
            
            var infobox = document.querySelector("#info-box");
            infobox.innerHTML = msg;

            
        }
        else{
            alert(server_res)
        }
    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function apiList(){
    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    const type  = 'apiList/'
    
    request.open("GET", address+type, true); 
    console.log(`Client> Sign-In request sent.`);

    request.onload = function() {
        
        server_res = this.response;
        server_res= JSON.parse(server_res);

        if (request.status == 200) {
                                 
            var infobox = document.querySelector("#info-box");
            infobox.innerHTML = "<h3>Api List </h3>";
            var apiList = document.createElement("ul");
            for (ele of server_res){
                var node = document.createElement("li");                 
                var textnode = document.createTextNode(ele);         
                node.appendChild(textnode);
                apiList.append(node);
            }

            infobox.appendChild(apiList);
        }
        else{
            alert(server_res);
            console.log(`Error occured. Status : ${request.status}`)
        }
    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function reservList(){
    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    const type  = 'getReservationList/'
    
    request.open("GET", address+type, true); 
    console.log(`Client> Reservation List request sent.`);
    
    request.onload = function() {
        
        server_res = this.response;
        const reserv_object = JSON.parse(server_res)
        let reserv_sort = Object.keys(reserv_object)
        reserv_sort.sort(function (usr1, usr2) {
            usr1.toLowerCase();
            usr2.toLowerCase();
            if (usr1 > usr2) {
                return -1;
            }
            if (usr2 > usr1) {
                return 1;
            }
            return 0;
        });

        if (request.status == 200) {

            var infobox = document.querySelector("#info-box");
            infobox.innerHTML = "<h3>Reservation List </h3>";
            var reservList = document.createElement("ol");

            for (ele of reserv_sort){
                var node = document.createElement("li");
                var reserv_info = '[User] '+reserv_object[ele].User + " [Date] "+ reserv_object[ele].Date +" [Time] "+ reserv_object[ele].Time +" [Hours] "+ reserv_object[ele].Hours             
                var textnode = document.createTextNode(reserv_info);         
                node.appendChild(textnode);
                reservList.append(node);
            }

            infobox.appendChild(reservList)

        }
        else{
            alert(server_res);
            console.log(`Error occured. Status : ${request.status}`)
        }
    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function reserv_request(){
    const request = new XMLHttpRequest();   
    let request_type = ''

    const type = document.querySelector("#type_reserve")
    _type = type[type.options.selectedIndex].text
    const user = document.querySelector("#user_reserve").value
    const date = document.querySelector("#date_reserve").value
    const time = document.querySelector("#time_reserve").value
    const hour = document.querySelector("#hour_reserve").value 
    

    if(_type == 'Create'){
        if(!user.length || !date.length || !time.length || !hour.length){return alert('Error: Fill all the information for your reservation')}
        request_type = 'createReservation/' + user + '/date/' + date + '/time/' + time + '/hrs/' + hour
    }else if(_type == 'Update'){
        if(!user.length || !date.length || !time.length || !hour.length){return alert('Error: Fill all the information for your reservation')}
        request_type = 'updateReservation/' + user + '/date/' + date + '/time/' + time + '/hrs/' + hour
    }else{
        if(!user.length){return alert('Error: Fill all the information for your reservation')}
        request_type = 'deleteReservation/' + user
    }

    console.log(address+request_type)
    
    request.open("POST", address+request_type, true);
    request.onload = function() {
        
        server_res = this.response;
        
        if (request.status == 200) {
            alert(server_res)
            console.log('Client> '+_type+' requested successfully.');
        }
        else{
            alert(server_res);
            console.log(`Error occured. Status : ${request.status}`)
        }
    }

    request.send()

}
