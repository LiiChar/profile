import React from "react";
import "./AboutMe.css";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutME = React.memo(function AboutME() {
  return (
    <div className="aboutMe">
      <div className="minePhoto">
        <Image
          alt="Photo"
          sizes="270px 270px"
          style={{ objectFit: "contain" }}
          src={"/image/icon/me.png"}
          fill={true}
        />
      </div>
      <div className="barsProgress">
        {infoTechnology.map((tech) => (
          <div key={tech.name} className="techInfo">
            <div>{tech.name}</div>
            <motion.div
              initial={{ width: 0 }}
              viewport={{ once: true }} 
            //   animate={{ width: tech.progress + "%" }}
              whileInView={{ width: tech.progress + "%" }}
              transition={{ duration: 1}}
              className="progressBar"></motion.div>
          </div>
        ))}
      </div>
    </div>
  );
})

const infoTechnology =  [
    { name: "JS", progress: 79 },
    { name: "CSS", progress: 77 },
    { name: "HTML", progress: 73 },
    { name: "REACT", progress: 65 },
    { name: "POSTGRES", progress: 42 },
    { name: "NEST", progress: 41 },
    { name: "NEXT", progress: 33 },
    { name: "MYSQL", progress: 30 },
    { name: "PHP", progress: 20 },
  ];

export default AboutME;