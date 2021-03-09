import "./Card.css";
import * as React from "react";
import { IPhoto, getPhotoURL } from "../Server/API";
import { Card } from "react-bootstrap";

const flickCardProps: { Photo: IPhoto } = { Photo: null }

export const FlickrCard: React.FC<typeof flickCardProps> = (props: typeof flickCardProps) => {
  const photoURL = getPhotoURL(props.Photo);
  const cardTextStyle: React.CSSProperties = {
    height: "8rem",
    overflowY: "auto",
    overflowX: "hidden"
  }

  return (
    <Card style={{ width: '22rem', display: "inline-block", margin: "0.5rem", borderColor: "#6c757d" }}>
      <Card.Img variant="top" src={photoURL} />
      <Card.Body>
        <Card.Title>{props.Photo.title || 'Unknown'}</Card.Title>
        <Card.Subtitle>{"by " + props.Photo.ownername}</Card.Subtitle>
        <Card.Text style={cardTextStyle}>
          {props.Photo.description._content}
        </Card.Text>
        <Card.Text style={cardTextStyle}>
          {props.Photo.tags.split(' ')
            .map((tag, i) => <React.Fragment key={`tag_${i}`}>
              <div className="Photo-Tag">{tag}</div>
            </React.Fragment>
            )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}