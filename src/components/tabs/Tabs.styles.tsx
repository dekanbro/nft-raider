import styled from 'styled-components';

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primary.step1};
`;

export const TabLinks = styled.div`
  background-color: ${({ theme }) => theme.primary.step1};
  display: flex;
  list-style: none;
  width: '100%';

  .nav-link-list {
    a {
      margin-right: 4rem;
    }
  }
  .mobile-box {
    padding: 2.6rem;
  }
`;

export const TabLink = styled.li`
  border-bottom: 2px transparent solid;
  color: ${({ theme }) => theme.secondary.step9};
  cursor: pointer;
  font-size: 2.2rem;
  letter-spacing: 1.5px;
  margin: 2.2rem 2.2rem 2.2rem 0;
  padding-bottom: 1rem;
  transition: 0.2s all;
  svg {
    margin-left: 0.3rem;
  }

  &:hover {
    color: ${({ theme }) => theme.secondary.step10};
    text-decoration: none;
  }

  &.selected {
    color: white;
    border-bottom: 2px ${({ theme }) => theme.secondary.step9} solid;
  }

  &.nav-tabs {
    padding-bottom: 1rem;
  }
`;