import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import WebStore from '../../store/WebStore';
import { observer } from 'mobx-react-lite';

const MyVerticallyCenteredModal = observer((props: any) => {


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {props.isAlert ? (
        <>
          <Modal.Body>
            {`Save your Cid phrase to acces to your addresses book ${WebStore.cidPhrase}`}
          </Modal.Body>
        </>
      ) : (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {WebStore.signature? 'Выберите вариант' : 'Подпишите сообщение в MetaMask и выберите вариант'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-grid gap-2">
              <Button onClick={props.onCidChange} variant="primary" size="lg" disabled={!Boolean(WebStore.signature)}>
                Ввести адрес списка
              </Button>
              <Button onClick={props.onCreateClick} variant="secondary" size="lg" disabled={!Boolean(WebStore.signature)}>
                Создать новый список
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => WebStore.setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </>)
      }

    </Modal >
  );
})

export default MyVerticallyCenteredModal;