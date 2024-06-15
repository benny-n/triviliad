import { Button, Typography } from "@mui/material"
import { useState } from "react"

export default function Irur(props: {answer: string}) {
    const onClick = () => {
        setShowIrur(true)
    }
    const acceptText = <Typography>
        {Math.random() < 0.7 ? "לא התקבל" : "הקתבל"}
    </Typography>
    const button = <Button
        variant="contained"
        onClick={onClick}
    >אני די בטוח שזה {props.answer}</Button>
    const [showIrur, setShowIrur] = useState<boolean>(false)
    return (
        showIrur ? acceptText : button
    )
}