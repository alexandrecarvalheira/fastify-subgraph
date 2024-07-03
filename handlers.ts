import axios from "axios";

type ReplyPayload = {
  error?: {
    code: string | number;
    message: string;
  };
  data: {
    result: boolean;
  };
};

export const graphHandler = async (request: any, reply: any) => {
  // Extract the address parameter from the query
  const { address } = request.query;

  console.log({ address });

  // Initialize a response object of type RequestPayload
  let response: ReplyPayload = {
    data: {
      result: false, // Default to false, assuming the task hasn't been done
    },
  };

  try {
    const result = await axios.post(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.API}/subgraphs/id/2QTvURKuumhtfvEDcNagcBvNcR1V8WhJ2R4DQYGBdRoN`,
      {
        query: `
            {
  swaps(
    where: {pair_: {id: "0x7bc09c730abc639509c72078430e9519f5ce46ae"}, from: "${address}", timestamp_gte: "1718334000"}
    first: 1
  ) {
    from
    amount0In
    amount0Out
    amount1In
    amount1Out
  }
}
            `,
      }
    );

    let taskDone: boolean;
    console.log("Query result: \n", result.data.data.swaps[0]);
    if (result.data.data.swaps[0]) {
      taskDone = true;
    } else {
      taskDone = false;
    }

    // Update the response based on the task completion status
    response.data.result = taskDone;

    // Send the response with a 200 status code
    reply.code(200).send(response);
  } catch (error) {
    response.error = {
      code: "UNKNOWN_ERROR",
      message: "Unknown error occurred",
    };

    reply.code(500).send(response);
  }
};
