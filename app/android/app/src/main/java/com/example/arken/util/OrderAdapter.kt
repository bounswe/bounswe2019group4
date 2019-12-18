package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.investment.Order

class OrderAdapter (
    val onOrderClickedListener:OnOrderClickedListener
) :
    RecyclerView.Adapter<OrderAdapter.OrderHolder>() {
    var dataSet: MutableList<Order> = mutableListOf()

    class OrderHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val orderText: TextView
        private val deleteButton:ImageButton

        init {
            orderText = v.findViewById(R.id.order_row_text)
            deleteButton = v.findViewById(R.id.order_delete)
        }

        fun bind(order: Order, onOrderClickedListener: OnOrderClickedListener,position: Int) {
            orderText.text = "${order.type.toString().toLowerCase()} ${order.amount} ${order.currency} when ${order.currency}/EUR is ${order.compare.toString().toLowerCase()} than ${order.rate}"
            deleteButton.setOnClickListener{
                onOrderClickedListener.onClicked(order._id!!,position)
            }

        }
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): OrderHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.order_row, viewGroup, false)

        return OrderHolder(v)
    }


    override fun onBindViewHolder(viewHolder: OrderHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val order = dataSet[position]
        viewHolder.bind(order,onOrderClickedListener,position)

    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}
interface OnOrderClickedListener {
    fun onClicked(orderId: String, position: Int)
}