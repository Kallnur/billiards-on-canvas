import { ChangeEvent, useState } from "react";
import { IBall } from "../../models/ball";

interface Props {
    selectedBall: IBall | null;
    closeModal: () => void;
    changeBallColor: (id: number, newColor: string) => void
}

const Modal = ({selectedBall, closeModal, changeBallColor}: Props) => {
    if(!selectedBall) return null;

    const [color, setColor] = useState<string>(selectedBall.color)
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        changeBallColor(selectedBall.id, newColor)
        setColor(newColor)
    }

  return (
    <div 
        className={`modal ${selectedBall ? "modal-active" : ""}`}
        onClick={closeModal}
    >
        <div className="modal__body" onClick={(e) => e.stopPropagation()}>
            <h3>Изменить цвет шара:</h3>
            <span>id: {selectedBall?.id}</span>
            <input 
                type="color" 
                value={color}
                onChange={handleChange}
            />
            <button onClick={closeModal}>Сохранить</button>
        </div>
    </div>
  )
}

export default Modal