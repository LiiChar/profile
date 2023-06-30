import React from "react";
import "./project.css";
import Image from "next/image";

const Project = React.memo(function Project({ data, close }) {
  const closeInfo = (e) => {
    e.stopPropagation();
    close();
  };

  return (
    <div onClick={closeInfo} className="projectMain">
      <div onClick={(e) => e.stopPropagation()} className="projectMainWrapper">
        <div className="wrapperImage">
          <div
            className="imagerat"
            style={{ width: "60vw", height: "35vw", position: "relative" }}>
            <Image
              alt="img"
              src={data.image}
              loader={() => data.image}
              className="imagerat"
              unoptimized={true}
              fill={true}
              placeholder="blur"
              blurDataURL={data.image}
            />
          </div>
        </div>
        <div className="wrapperProjectInfo">
          <div className="nameProjectMore">
            <div className="">{data.name}</div>
          </div>
          <div className="descriptionProjectMore">{data.description}</div>
          <div className="linskProjectMore">
            <div>Link to code: {data.linkProd}</div>
            {data.linkProd != "" && <div>Link to website: {data.linkProd}</div>}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Project;
