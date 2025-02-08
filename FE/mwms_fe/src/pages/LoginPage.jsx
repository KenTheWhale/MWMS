import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <>
            <Button variant={"success"} onClick={() => {navigate("/manager")}}>Manager pages</Button>
            <Button variant={"success"} onClick={() => {navigate("/staff")}}>Staff pages</Button>
            <Button variant={"success"} onClick={() => {navigate("/admin")}}>Admin pages</Button>
            <Button variant={"success"} onClick={() => {navigate("/sp")}}>Supplier pages</Button>
            <Button variant={"success"} onClick={() => {navigate("/rq")}}>Requester pages</Button>
        </>
    )
}