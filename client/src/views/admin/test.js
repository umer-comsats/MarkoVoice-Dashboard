// import external modules
import React, { Component, Fragment } from "react";
import { Row, Col, Card } from "reactstrap";

import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";

class TestPage extends Component {
    render() {
        return (
            <Fragment>
                <ContentHeader>Test</ContentHeader>
                <ContentSubHeader>A sample blank page to start with</ContentSubHeader>
                <Card>
                    <Row>
                        <Col md="6" xs="12">
                            <ContentHeader>Card</ContentHeader>
                            <ContentSubHeader>This is card</ContentSubHeader>
                        </Col>
                        <Col md="6" xs="12">
                            <ContentHeader>Card2</ContentHeader>
                            <ContentSubHeader>This is card2</ContentSubHeader>
                        </Col>
                    </Row>
                </Card>
            </Fragment>

        );
    }
}

export default TestPage;
