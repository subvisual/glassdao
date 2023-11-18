import { useRouter } from "next/router";
import { useState } from "react";
import IdCard from "../../components/IdCard";
import { Card, Typography, Tag } from "@ensdomains/thorin";
import Flex from "../../components/Flex";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 70%;
  margin: 50px auto 0;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function DAO() {
  const router = useRouter();
  const { address } = router.query;
  const [data, setData] = useState<Record<string, string>>({});

  //fetchData.then(res => setData(res.data))

  return (
    <Wrapper>
      <IdCard avatar={data.avatar} name={data.name} ensName={data.ensName} />
      <Card>
        <Typography>About</Typography>
        <Flex justifyContent="start">
          <Tag>{data.sector}</Tag>
        </Flex>
        <Typography>{data.bio}</Typography>
      </Card>
    </Wrapper>
  );
}

export default DAO;
