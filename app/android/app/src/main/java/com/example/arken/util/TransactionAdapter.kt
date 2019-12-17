package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.investment.TransactionHistory

class TransactionAdapter():
    RecyclerView.Adapter<TransactionAdapter.TransactionHolder>() {
    var dataSet: MutableList<TransactionHistory> = mutableListOf()

    class TransactionHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val transactionText: TextView
        private val rate: TextView
        private val date: TextView
        private val profit: TextView

        init {
            transactionText = v.findViewById(R.id.investment_row_text)
            rate = v.findViewById(R.id.investment_row_from_rate)
            date = v.findViewById(R.id.investment_row_date)
            profit = v.findViewById(R.id.investment_row_profit)
        }

        fun bind(transactionHistory: TransactionHistory) {
            transactionText.text=transactionHistory.text
            rate.text="From Rate = ${transactionHistory.fromRate}"
            date.text=transactionHistory.date.toString()
            profit.text=transactionHistory.profit.toString()
        }
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): TransactionHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.investment_row, viewGroup, false)

        return TransactionHolder(v)
    }


    override fun onBindViewHolder(viewHolder: TransactionHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val transaction = dataSet[position]
        viewHolder.bind(transaction)

    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}