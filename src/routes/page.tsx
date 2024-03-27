import { Helmet } from '@modern-js/runtime/head';
import NesHeaderViewer from '@/components/NesHeaderViewer';

const Index = () => {
  return (
    <>
      <Helmet title="NES文件头查看器" />
      <NesHeaderViewer />
    </>
  );
};

export default Index;
