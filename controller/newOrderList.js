const Order = require('../model/newOrderList');
const Response = require('../utils/response');

class OrderService {
    static async createOrder(req, res) {
        try {
            const order = await Order.create(req.body);
            return Response.created(res, "Order created successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to create order", error);
        }
    }

    static async createMaterial(req, res) {
        try {
            const order = await Order.findById(req.params.orderId);
            if (!order) return Response.notFound(res, "Order not found");

            order.materials.push(req.body);
            await order.save();

            return Response.success(res, "Material added successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to add material", error);
        }
    }

    static async getOrders(req, res) {
        try {
            const orders = await Order.find(req.query);
            return Response.success(res, "Orders retrieved successfully", orders);
        } catch (error) {
            return Response.serverError(res, "Failed to retrieve orders", error);
        }
    }

    static async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) return Response.notFound(res, "Order not found");
            return Response.success(res, "Order retrieved successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to retrieve order", error);
        }
    }

    static async updateOrder(req, res) {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!order) return Response.notFound(res, "Order not found");
            return Response.success(res, "Order updated successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to update order", error);
        }
    }

    static async deleteOrder(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) return Response.notFound(res, "Order not found");
            return Response.success(res, "Order deleted successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to delete order", error);
        }
    }

    static async deleteMaterialById(req, res) {
        try {
            const order = await Order.findById(req.params.orderId);
            if (!order) return Response.notFound(res, "Order not found");

            order.materials = order.materials.filter(material => material.productId !== req.params.materialId);
            await order.save();
            return Response.success(res, "Material deleted successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to delete material", error);
        }
    }

    static async deleteAllMaterials(req, res) {
        try {
            const order = await Order.findById(req.params.orderId);
            if (!order) return Response.notFound(res, "Order not found");

            order.materials = [];
            await order.save();
            return Response.success(res, "All materials deleted successfully", order);
        } catch (error) {
            return Response.serverError(res, "Failed to delete all materials", error);
        }
    }
}

module.exports = OrderService;