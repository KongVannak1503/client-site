import { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'


const GoogleDrivePicker = () => {
    // const [openPicker, authResponse] = useDrivePicker();
    // const handleOpenPicker = () => {
    //     openPicker({
    //         clientId: "653905790179-m1i3mpcd00l3b7voa005ni27uospgk7l.apps.googleusercontent.com",
    //         developerKey: "AIzaSyCnBzanZFnXXl-6XUL1AoK57xPREf1UZLA",
    //         viewId: "DOCS",
    //         // token: token, // pass oauth token in case you already have one
    //         showUploadView: true,
    //         showUploadFolders: true,
    //         supportDrives: true,
    //         multiselect: true,
    //         // customViews: customViewsArray, // custom view
    //         callbackFunction: (data) => {
    //             if (data.action === 'cancel') {
    //                 console.log('User clicked cancel/close button')
    //             }
    //             console.log(data)
    //         },
    //     })
    // }
    return (
        <div>
            {/* <button onClick={() => handleOpenPicker()}>Open Picker</button> */}
        </div>

    );
};

export default GoogleDrivePicker;
