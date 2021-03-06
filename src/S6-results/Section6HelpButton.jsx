import React from "react";
import store from "../store";
import { easyComp } from "react-easy-state";
import { Transition, Button } from "semantic-ui-react";

const Section6HelpButton = () => {
  let showDownloadOutputButtons = store.getState("showDownloadOutputButtons");

  return (
    <Transition
      visible={showDownloadOutputButtons}
      animation="fade"
      duration={1000}
    >
      <div>
        <a
          href="https://github.com/shawnbanasick/ken-q-analysis/wiki/6.-OUTPUT"
          target="_blank"
          rel="noopener noreferrer"
          style={{ targetNew: "tab" }}
        >
          <Button
            id="section6HelpButton"
            floated="right"
            size="huge"
            style={{ marginLeft: 65, marginTop: 20 }}
            basic
          >
            <strong style={{ color: "#2185d0" }}>Help - Section 6</strong>
          </Button>
        </a>
      </div>
    </Transition>
  );
};

export default easyComp(Section6HelpButton);
