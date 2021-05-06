import { NextApiHandler } from "next";

const aqiHandler: NextApiHandler = async (_, res) => {
    return res.json(true);
};

export default aqiHandler;
