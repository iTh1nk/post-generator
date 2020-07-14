/*
 * Created on Sun Jul 12 2020
 *
 * Copyright (c) 2020 We0mmm
 */
import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  CardDeck,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Button,
} from "reactstrap";
import IsLoadingPlaceholder from "./IsLoadingPlaceholder";

export default function ImagePicker(props) {
  const [imagePicker, setImagePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  const setImagePickerFunc = (e) => {
    e.preventDefault();
    setImagePicker(false);
  };

  useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/api/v1/images/getall", {
      headers: { Authorization: localStorage.getItem("auth") },
    })
      .then((resp) => {
        setIsLoading(false);
        setImages(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {props.selectedImage === "" || props.selectedImage === undefined ? null : (
        <img
          style={{ width: "8em", height: "5em", display: "block" }}
          alt="Selected Image"
          src={
            process.env.REACT_APP_API +
            "/api/v1/images/get" +
            props.selectedImage
          }
        />
      )}
      <a href="#">
        <Badge
          style={{ marginLeft: "1em" }}
          color="success"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setImagePicker(true);
          }}
        >
          Pick Image
        </Badge>
      </a>
      {/* Image Picker Modal */}
      <Modal
        isOpen={imagePicker}
        toggle={(e) => {
          e.preventDefault();
          setImagePicker(!imagePicker);
        }}
      >
        <ModalHeader
          toggle={(e) => {
            e.preventDefault();
            setImagePicker(!imagePicker);
          }}
        >
          Image Picker
        </ModalHeader>
        <ModalBody>
          <CardDeck>
            {isLoading ? (
              <IsLoadingPlaceholder />
            ) : (
              images.map((item, idx) => (
                <div key={idx} style={{ textAlign: "center", margin: "1em" }}>
                  <a href="#">
                    <img
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePickerFunc(e);
                        props.cbSelected(e, item.path);
                      }}
                      style={{ width: "8em", height: "5em" }}
                      alt="All Images"
                      src={
                        process.env.REACT_APP_API +
                        "/api/v1/images/get" +
                        item.category +
                        item.name +
                        ".png"
                      }
                    />
                  </a>
                  <br />
                  {item.name}
                </div>
              ))
            )}
          </CardDeck>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setImagePicker(!imagePicker);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
