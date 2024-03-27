import {
  Flex,
  Button,
  Upload,
  Descriptions,
  DescriptionsProps,
  Empty,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from '@modern-js/runtime/model';
import { RcFile } from 'antd/es/upload';
import { useMemo } from 'react';
import { INesRomModel } from '@/models/INesRom';
import { toHexString } from '@/utils/HexUtil';

const NesHeaderViewer = () => {
  const [rom, actions] = useModel(INesRomModel);
  const { fileName, header, version } = rom;

  function open(file: RcFile) {
    file.arrayBuffer().then(buffer => {
      actions.setFileName(file.name);
      actions.setBytes(new Uint8Array(buffer));
    });
    return false;
  }

  const prgBanks = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    return `${header[4]}（${header[4] * 16}kB）`;
  }, [header]);

  const chrBanks = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    return `${header[5]}（${header[5] * 8}kB）`;
  }, [header]);

  const mapper = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const lower = header[6] >> 4;
    const upper = header[7] >> 4;
    const mapperId = (upper << 4) | lower;
    const mapperIdHex = mapperId.toString(16).padStart(2, '0').toUpperCase();
    return `${mapperId}（${mapperIdHex}）`;
  }, [header]);

  const mirroring = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = header[6] & 0x01;
    const type = value === 0 ? '垂直' : '水平';
    return `${type}（${value}）`;
  }, [header]);

  const battery = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = (header[6] & 0x02) >> 1;
    const type = value === 1 ? '有' : '无';
    return `${type}（${value}）`;
  }, [header]);

  const trainer = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = (header[6] & 0x04) >> 2;
    const type = value === 1 ? '有' : '无';
    return `${type}（${value}）`;
  }, [header]);

  const fourScreen = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = (header[6] & 0x08) >> 3;
    const type = value === 1 ? '是' : '否';
    return `${type}（${value}）`;
  }, [header]);

  const vsUnisystem = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = header[7] & 0x01;
    const type = value === 1 ? '是' : '否';
    return `${type}（${value}）`;
  }, [header]);

  const playChoice10 = useMemo(() => {
    if (header === undefined) {
      return undefined;
    }
    const value = (header[7] & 0x02) >> 1;
    const type = value === 1 ? '是' : '否';
    return `${type}（${value}）`;
  }, [header]);

  const iNesVersion = useMemo(() => {
    if (version === undefined) {
      return undefined;
    }
    let versionName = '未知';
    if (version === 0 || version === 1) {
      versionName = '1.0';
    }
    if (version === 2) {
      versionName = '2.0';
    }
    return `${versionName}（${version}）`;
  }, [header]);

  const basicItems: DescriptionsProps['items'] = [
    {
      key: 'file-name',
      label: '文件名',
      span: 2,
      children: <>{fileName}</>,
    },
    {
      key: 'hex',
      label: '十六进制',
      span: 2,
      children: <>{toHexString(header, ' ', true)}</>,
    },
    {
      key: 'prg',
      label: 'PRG-ROM Bank 数量',
      children: <>{prgBanks}</>,
    },
    {
      key: 'chr',
      label: 'CHR-ROM Bank 数量',
      children: <>{chrBanks}</>,
    },
    {
      key: 'mapper',
      label: 'Mapper 编号',
      children: <>{mapper}</>,
      span: 2,
    },
    {
      key: 'mirroring',
      label: '镜像',
      children: <>{mirroring}</>,
    },
    {
      key: 'battery',
      label: '电池记忆',
      children: <>{battery}</>,
    },
    {
      key: 'trainer',
      label: 'Trainer',
      children: <>{trainer}</>,
    },
    {
      key: 'four-screen',
      label: '四屏 VRAM 布局',
      children: <>{fourScreen}</>,
    },
    {
      key: 'vs-unisystem',
      label: 'VS Unisystem',
      children: <>{vsUnisystem}</>,
    },
    {
      key: 'play-choice-10',
      label: 'PlayChoice-10',
      children: <>{playChoice10}</>,
    },
    {
      key: 'ines-version',
      label: 'iNES格式版本',
      children: <>{iNesVersion}</>,
      span: 2,
    },
    // {
    //   key: 'prg-ram-size',
    //   label: 'PRG-RAM大小',
    //   children: <>{prgRamSize}</>,
    // },
    // {
    //   key: 'tv-system',
    //   label: '制式',
    //   children: <>{tvSystem}</>,
    // },
  ];

  const extItems: DescriptionsProps['items'] = [];
  if (version !== undefined) {
    if (version < 2) {
      //
    } else if (version === 2) {
      //
    }
  }

  return (
    <Flex vertical gap={8}>
      <Flex gap={8} align={'center'}>
        <Upload maxCount={1} showUploadList={false} beforeUpload={open}>
          <Button size={'middle'} icon={<UploadOutlined />}>
            打开
          </Button>
        </Upload>
        {fileName}
      </Flex>
      {header !== undefined ? (
        <Descriptions
          bordered
          column={4}
          items={[...basicItems, ...extItems]}
        />
      ) : (
        <Empty description={'无效的iNES ROM，无法获取文件头'} />
      )}
    </Flex>
  );
};

export default NesHeaderViewer;
