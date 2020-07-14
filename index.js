import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  CardBody,
} from "reactstrap";
import stylesJson from "./src/cssGeneral.json";
import ImagePicker from "./src/We0m_ImagePicker";

export default function PostGenerator(props) {
  const [selectedImageArr, setSelectedImageArr] = useState([]);
  const [addFieldModal, setAddFieldModal] = useState(false);
  const [addFieldImageCount, setAddFieldImageCount] = useState(0);
  const [addFieldTextCount, setAddFieldTextCount] = useState(0);
  const [addFieldCount, setAddFieldCount] = useState(0);
  const [addField, setAddField] = useState([]);
  const [contentAdd, setContentAdd] = useState("");

  useEffect(() => {
    if (!props.reDoPostGen) setAddField([]);
  }, [props.reDo]);

  const setSelectedImageFunc = (e, str, genId) => {
    e.preventDefault();
    //chk if user is changing previous image
    for (let i = 0; i < addField.length; i++) {
      if (addField[i].genId === genId) {
        selectedImageArr[addField[i].imageCount] = str;
        setSelectedImageArr([...selectedImageArr]);
        document.getElementById(genId).value = str;
        handleAddFieldOnChange(e);
        return;
      }
    }
    setSelectedImageArr([...selectedImageArr, str]);
    document.getElementById(genId).value = str;
    handleAddFieldOnChange(e);
  };

  const handleAddParagraph = (e) => {
    setAddField([
      ...addField,
      {
        type: "text",
        count: addFieldCount,
        textCount: addFieldTextCount,
        genId: "addFieldText" + addFieldCount.toString(),
      },
    ]);
    setAddFieldCount(addFieldCount + 1);
    setAddFieldTextCount(addFieldTextCount + 1);
  };
  const handleAddImage = (e) => {
    setAddField([
      ...addField,
      {
        type: "image",
        count: addFieldCount,
        imageCount: addFieldImageCount,
        genId: "addFieldImage" + addFieldCount.toString(),
      },
    ]);
    setAddFieldCount(addFieldCount + 1);
    setAddFieldImageCount(addFieldImageCount + 1);
  };
  //Add Field Compose Data Handler
  const handleAddFieldOnChange = (e) => {
    let content = "";
    for (let i = 0; i < addField.length; i++) {
      if (
        addField[i].type === "text" &&
        document.getElementById(addField[i].genId).value.split("").length !== 0
      ) {
        content +=
          "<p style='text-align: left'>" +
          document.getElementById(addField[i].genId).value +
          "</p>";
      } else if (
        document.getElementById(addField[i].genId).value.split("").length !== 0
      ) {
        content +=
          "<img alt='News Image' style='width: 18em; height: 26em; text-align: center; margin: 2em' src='" +
          process.env.REACT_APP_API +
          "/api/v1/images/get" +
          document.getElementById(addField[i].genId).value +
          "' /><br />";
      }
    }
    setContentAdd(content);
    props.cb(e, content);
  };

  return (
    <div style={{ marginLeft: ".8em" }}>
      {addField.map((item, idx) => (
        <div key={idx}>
          <FormGroup>
            <Label style={stylesJson.formField.label}>
              -{" "}
              {item.type === "text"
                ? "Insert Paragraph (" + (item.textCount + 1) + "):"
                : "Insert Image (" + (item.imageCount + 1) + "):"}
            </Label>
            {item.type === "text" ? (
              <Input
                id={item.genId}
                type="textarea"
                style={stylesJson.formField.field}
                placeholder="Input case content here..."
                onChange={(e) => handleAddFieldOnChange(e, props.values)}
              />
            ) : (
              <div>
                {selectedImageArr[item.imageCount] ===
                undefined ? null : selectedImageArr.length === 0 ? null : (
                  <img
                    style={{ width: "8em", height: "5em" }}
                    alt="Selected Image"
                    src={
                      process.env.REACT_APP_API +
                      "/api/v1/images/get" +
                      selectedImageArr[item.imageCount]
                    }
                  />
                )}
                <ImagePicker
                  cbSelected={(e, str) =>
                    setSelectedImageFunc(e, str, item.genId)
                  }
                  selectedImage={selectedImageArr[addField[addFieldImageCount]]}
                />
                {/* C1: In order to get getElementById("") work and don't need to change next logic function */}
                <Input
                  id={item.genId}
                  type="textarea"
                  style={{ display: "none" }}
                  placeholder="Input case content here..."
                />
                {/* C1 End */}
              </div>
            )}
          </FormGroup>
        </div>
      ))}
      <Button
        size="sm"
        type="button"
        color="primary"
        outline
        onClick={(e) => handleAddParagraph(e)}
      >
        Add Paragraph
      </Button>{" "}
      <Button
        size="sm"
        type="button"
        color="primary"
        outline
        onClick={(e) => handleAddImage(e)}
      >
        Add Image
      </Button>{" "}
      <Button
        size="sm"
        type="button"
        color="secondary"
        outline
        onClick={(e) => {
          e.preventDefault();
          setAddField([]);
          setSelectedImageArr([]);
          setAddFieldImageCount(0);
          setAddFieldTextCount(0);
          setAddFieldCount(0);
          setContentAdd("");
        }}
      >
        Re-do
      </Button>{" "}
      <Button
        size="sm"
        type="button"
        color="success"
        outline
        onClick={(e) => {
          e.preventDefault();
          setAddFieldModal(true);
        }}
      >
        Preview
      </Button>
      {/* Add Field Preview Modal */}
      <Modal
        isOpen={addFieldModal}
        toggle={(e) => {
          e.preventDefault();
          setAddFieldModal(false);
        }}
      >
        <ModalHeader>Content Preview</ModalHeader>
        <ModalBody>
          <CardBody
            style={{
              backgroundColor: "#14365f",
              color: "white",
              textAlign: "center",
            }}
          >
            <div>
              <br />
              <div>
                <div dangerouslySetInnerHTML={{ __html: contentAdd }} />
              </div>
            </div>
          </CardBody>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              setAddFieldModal(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
