import styled from "styled-components";

export const Container = styled.div`
    width: 40vw;
    position: relative;
    display: flex;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;

        .logo {
            width: 300px;
            padding: 25px 5px 25px 25px;
            cursor: pointer;
        }        
    }

    .salmon-btn{
        position: absolute;
        top: 150px;
        right: 0;
    }
    
`;
