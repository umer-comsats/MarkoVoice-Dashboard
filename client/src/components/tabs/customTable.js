/**
 * Author: Muhammad Mansha
 * Date: 14/07/2020
 * What this component wil do: 
 */

import React from "react";
import {
    Table,
    TabContent,
    Row,
    Col
} from "reactstrap";

class CustomTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Table striped className="px-0">
                <Row>
                    <Col sm="12">
                        {this.props.TableContent}
                    </Col>
                </Row>
            </Table>
        );
    }
}

export default CustomTable;