import { useState } from 'react'; 
import { Table, Popconfirm, message, Button, Space, Input } from 'antd'; 
import { DeleteOutlined } from '@ant-design/icons';
import ProductFormManager from '../baitap1';

const { Search } = Input;

interface Product {
    key: string;
    stt: number;
    tenSP: string;
    gia: number;
    soLuong: number;
}

const initialData: Product[] = [
    { key: '1', stt: 1, tenSP: 'Laptop Dell', gia: 18000000, soLuong: 10 },
    { key: '2', stt: 2, tenSP: 'Chuột Logitech', gia: 450000, soLuong: 25 },
    { key: '3', stt: 3, tenSP: 'Bàn phím cơ', gia: 1500000, soLuong: 0 },
    { key: '4', stt: 4, tenSP: 'Màn hình LG', gia: 3200000, soLuong: 8 },
    { key: '5', stt: 5, tenSP: 'Tai nghe Sony', gia: 8500000, soLuong: 5 },
];

const MyTable = () => {
    const [data, setData] = useState(initialData);

    const handleSearch = (value: string) => {
        const keyword = value.toLowerCase();
        const filtered = initialData.filter(item => 
            item.tenSP.toLowerCase().includes(keyword)
        );
        setData(filtered);
    };
    const handleDelete = (key: string) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success('Đã xóa sản phẩm thành công!');
    };

    const columns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt' },
        { title: 'Tên sản phẩm', dataIndex: 'tenSP', key: 'tenSP' },
        {
            title: 'Giá',
            dataIndex: 'gia',
            key: 'gia',
            render: (gia: number) => gia?.toLocaleString() + ' đ',
        },
        { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
        {
            title: 'Thao tác',
            key: 'thaoTac',
            render: (_: any, record: Product) => (
                <Space size='middle'>
                    <a style={{ color: '#1890ff' }}>Sửa</a>
                    <Popconfirm
                        title='Bạn có chắc chắn muốn xóa sản phẩm này không?'
                        onConfirm={() => handleDelete(record.key)}
                        okText='Có'
                        cancelText='Không'
                        okButtonProps={{ danger: true }}
                    >
                        <Button type='text' danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Quản lý sản phẩm</h3>
                
                <Space>
                    <Search
                        placeholder="Tìm theo tên sản phẩm..."
                        allowClear
                        onChange={(e) => handleSearch(e.target.value)} 
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                    <ProductFormManager />
                </Space>
            </div>

            <Table 
                columns={columns} 
                dataSource={data} 
                bordered 
                rowKey='key' 
            />
        </div>
    );
};

export default MyTable;