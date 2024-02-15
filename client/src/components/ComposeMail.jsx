import { useState } from "react";
import { Dialog, Box, Typography, styled, InputBase, TextField } from "@mui/material";
import {Close, DeleteOutline} from "@mui/icons-material";
import useApi from "../hooks/useApi";
import { API_URLS } from "../services/api.urls";

const dialogStyle = {
    height: '80%',
    width: '70%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 0 0', 
}

const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    background: '#F8F4EC',
    '& > p':{
        fontSize: 14, 
        fontWeight: 500
    }
});

const RecipientsWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    padding: '0 15px',
    '& > div':{
        fontSize: 14,
        borderBottom: '1px solid #F3EEEA', 
        marginTop: 10
    }
});

const Footer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    alignItems: 'center'
});

const SendButton = styled(Box)({
    background: '#0B60B0',
    color: '#F3F8FF',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: 15,
    width: 60,  
    paddingLeft: 15,
    paddingTop: 5, 
    paddingBottom: 5,
    alignItems: 'center'
    
})
const ComposeMail = ({openDialog, setOpenDialog}) =>{
    const [data, setData] = useState({});
    const sentEmailService = useApi(API_URLS.saveSentEmail);
    const saveDraftService = useApi(API_URLS.saveDraftEmails);

    const config = {
           Host : "smtp.elasticemail.com",
            Username : "codeforces213@yopmail.com",
            Password : "F733B6FA5F818A49D91E0160A8C144B0B5E5",
            Port: 2525, 
    }
    const closeComposeMail = (e) =>{
        e.preventDefault(); 

        const payload = {
            to: data.to, 
            from: 'abhaymishra94814@gmail.com',
            subject: data.subject,
            body: data.body,
            date: new Date(),
            image: '',
            name: 'abhay mishra',
            starred: 'false',
            type: 'drafts',

        }

        saveDraftService.call(payload);
        if(!saveDraftService)
        {
            setOpenDialog(false);
            setData({});
        }else{
            
        }
        setOpenDialog(false);

    }

    const sendMail = (e) => {
        e.preventDefault();
        if(window.Email){ 
         window.Email.send({
            ...config,
            To : data.to,
            From : "abhaymishra94814@gmail.com",
            Subject : data.subject,
            Body : data.body
        }).then(
          message => alert(message)
        );
        }

        const payload = {
            to: data.to, 
            from: 'abhaymishra94814@gmail.com',
            subject: data.subject,
            body: data.body,
            date: new Date(),
            image: '',
            name: 'abhay mishra',
            starred: 'false',
            type: 'sent',

        }

        sentEmailService.call(payload);
        if(!sentEmailService)
        {
            setOpenDialog(false);
            setData({});
        }else{
            
        }
        setOpenDialog(false);
    }

    const onValueChange = (e) =>{
        setData({...data, [e.target.name]: e.target.value}) 
    }
    return(
        <Dialog
          open = {openDialog}
          PaperProps={{sx: dialogStyle}}
        >
           <Header>
                <Typography>New Message</Typography>
                <Close fontSize="small" onClick={(e) => closeComposeMail(e)}/>
           </Header>
           <RecipientsWrapper>
                <InputBase placeholder="Recipients" name = "to" onChange={(e) => onValueChange(e)}/>
                <InputBase placeholder="Subject" name = "subject" onChange={(e) => onValueChange(e)}/>
           </RecipientsWrapper>
           <TextField 
                multiline
                rows = {12}
                sx= {{'& .MuiOutlinedInput-notchedOutline': {border: 'none'}}}
                onChange={(e) => onValueChange(e)}
                name = "body"
           />
           <Footer>
            <SendButton onClick={(e) => sendMail(e)}>Send</SendButton>
            <DeleteOutline onClick={()=> setOpenDialog(false)}/>
           </Footer>
        </Dialog> 
    )
}

export default ComposeMail;