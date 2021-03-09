import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FlickrCard } from "./Components/FlickrCard";
import { fetchPhotos, IFlickrResponse } from "./Server/API";

export const FlickrContainer = () => {
  const [feed, setFeed] = React.useState<IFlickrResponse>(null);

  const _fetchSearchPhotos = (tags: string = "") => {
    try {
      // Tags are in fact entered with spaces in between in the Flickr UI, so let's allow for that here too.
      const tagsParam = tags.replace(' ', ',');
      fetchPhotos(tagsParam)
        .then((photos: IFlickrResponse) => setFeed(photos));
    } catch (e) {
      alert('Could not retrieve photos. Please check your credentials.');
      console.log(e);
    }
  }
  React.useEffect(() => {
    _fetchSearchPhotos();
  }, []);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          {/* TODO Implement search and filter toolbar */}
        </Col>
      </Row>

      <Row>
        <Col>
          {/* TODO Implement infinite scroll */}
          {feed?.photos?.photo.map(p =>
            <React.Fragment key={p.id}>
              <FlickrCard Photo={p} />
            </React.Fragment>
          )}
        </Col>
      </Row>
    </Container>
  )
}