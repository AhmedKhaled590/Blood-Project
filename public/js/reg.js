
function UserChanged() {
    var UserType = document.getElementById("user");
    if (UserType.value == "Donor"||UserType.value=="Recipient") {
        $("#organization").hide(1000,()=>{
            $("#person").show(1000);
        });

    }

    else if (UserType.value == 'Organization') {
        $("#person").hide(1000,()=>{
            $("#organization").show(1000);

        });

    }
    else if (UserType.value == 'NULL') {
        $("#person").hide(1000);
        $("#organization").hide(1000);
        
    }
}
