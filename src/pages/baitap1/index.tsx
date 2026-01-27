import { useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProductFormManager = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [form] = Form.useForm();

	const openForm = () => setIsDrawerOpen(true);
	const closeForm = () => {
		setIsDrawerOpen(false);
		form.resetFields();
	};

	const handleSubmit = (values: any) => {
		console.log('Dữ liệu:', values);
		message.success('Đã thêm sản phẩm thành công!');
		closeForm();
	};

	return (
		<>
			<Button type='primary' icon={<PlusOutlined />} onClick={openForm}>
				Thêm sản phẩm mới
			</Button>

			<Drawer
				title='Thông tin sản phẩm'
				width={450}
				onClose={closeForm}
				visible={isDrawerOpen}
				destroyOnClose
				footer={
					<div style={{ textAlign: 'right' }}>
						<Space>
							<Button onClick={closeForm}>Hủy</Button>
							<Button type='primary' onClick={() => form.submit()}>
								Xác nhận
							</Button>
						</Space>
					</div>
				}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit} autoComplete='off'>
					<Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true, message: 'Tên không được để trống' }]}>
						<Input placeholder='Nhập tên sản phẩm' />
					</Form.Item>

					<Form.Item
						name='price'
						label='Giá (VNĐ)'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá' },
							{ type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
						]}
					>
						<InputNumber style={{ width: '100%' }} placeholder='0' />
					</Form.Item>

					<Form.Item
						name='quantity'
						label='Số lượng'
						rules={[
							{ required: true, message: 'Vui lòng nhập số lượng' },
							{
								validator: (_: any, value: any) =>
									value > 0 && Number.isInteger(value)
										? Promise.resolve()
										: Promise.reject('Số lượng phải là số nguyên dương'),
							},
						]}
					>
						<InputNumber style={{ width: '100%' }} placeholder='0' />
					</Form.Item>
				</Form>
			</Drawer>
		</>
	);
};

export default ProductFormManager;