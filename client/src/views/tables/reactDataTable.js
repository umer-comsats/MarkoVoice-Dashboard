import React, { Component, Fragment } from "react";

import CustomTabs from "../../components/tabs/customTabs";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Card, CardBody, CardTitle, Alert, Row, Col } from "reactstrap";

//Prism
// eslint-disable-next-line
import Prism from "prismjs";  //Include JS
import "prismjs/themes/prism-okaidia.css"; //Include CSS
import { PrismCode } from "react-prism"; //Prism Component

// Table exmple pages
import ReactTreeTableExample from "./examples/reactTreeTable";
import ReactSelectTableExample from "./examples/reactSelectTable";
import ReactFoldableTableExample from "./examples/reactFoldableTable";


//Table exmple souece pages
import ReactTreeTableSource from "./example-source/reactTreeTable";
import ReactSelectTableSource from "./example-source/reactSelectTable";
import ReactFoldableTableSource from "./example-source/reactFoldableTable";

class reactTableExtended extends Component {
    render() {
        return (
            <Fragment>
                <ContentHeader>React Tables</ContentHeader>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <CardTitle>Select Table</CardTitle>
                                <CustomTabs
                                    TabContent1={<ReactSelectTableExample />}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default reactTableExtended;
