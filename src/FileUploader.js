import React, { useState } from "react";
import { AffindaCredential, AffindaAPI } from "@affinda/affinda";
// import makeStyles from '@mui/styles/makeStyles';
import styles1 from './fileuploader.module.css';
import { jsPDF } from "jspdf";

import {
    TextField,
    Button,
    CircularProgress,
    Snackbar,
} from "@mui/material";

const credential = new AffindaCredential("2479743de895f80162ed0b3f7caada92d0e0cb15");
const client = new AffindaAPI(credential);

function FileUploader() {
    // const classes = useStyles();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile({ file, path: file.path });
        console.log(file.path);
    };


    const handleSubmit = () => {
        client.createResume({ url: "https://drive.google.com/file/d/11AIBs7QYibaUxKxiPqElBEwSScy7FY9Y/view?usp=share_link" }).then((result) => {
            console.log("Returned data:");
            console.dir(result);
            console.dir(result.data.name);
            const doc = new jsPDF({unit: "px"});
            var x = 10;
            doc.text(JSON.stringify(result.data.name), 10, x);
            x+=20;
            doc.text(JSON.stringify(result.data.certifications), 10, x, {maxWidth:500});
            x+=20;
            doc.text(JSON.stringify(result.data.education[0].organization), 10, x, {maxWidth:500});
            x+=20;
            doc.text(JSON.stringify(result.data.emails), 10, x, {maxWidth:500});
            x+=20;
            doc.text(JSON.stringify(result.data.linkedin), 10, x, {maxWidth:500});
            x+=20;
            doc.text(JSON.stringify(result.data.location.formatted), 10, x, {maxWidth:500});
            x+=20;
            doc.text(JSON.stringify(result.data.phoneNumbers), 10, x, {maxWidth:500});
            x=10;
            doc.addPage();
            doc.text(JSON.stringify(result.data.skills), 10, x, {maxWidth:500});

            doc.save("a4.pdf");

        }).catch((err) => {
            console.log("An error occurred:");
            console.error(err);
        });
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <TextField
                type="file"
                onChange={handleFileChange}
                className={"textField"}
            />
            <Button
                onClick={handleSubmit}
                className={styles1.btn}>
                Submit
            </Button>
            {loading && <CircularProgress />}
            <Snackbar
                open={open}
                message={message}
                onClose={handleClose}
            />
        </div>
    );
}

export default FileUploader;