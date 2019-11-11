package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.model.tradingEquipment.CurrencyValue

class CurrencyValueAdapter() : RecyclerView.Adapter<CurrencyValueAdapter.CurrencyValueHolder>() {

    var dataSet: MutableList<CurrencyValue> = mutableListOf()

    class CurrencyValueHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val open: TextView
        private val high: TextView
        private val low: TextView
        private val close: TextView
        private val date: TextView

        init {


            open = v.findViewById(R.id.currencyRowValueOpen)
            high = v.findViewById(R.id.currencyRowValueHigh)
            low = v.findViewById(R.id.currencyRowValueLow)
            close = v.findViewById(R.id.currencyRowValueClose)
            date = v.findViewById(R.id.currencyRowDate)
        }

        fun bind(current: CurrencyValue) {

            open.text = current.open
            high.text=current.high
            low.text=current.low
            close.text=current.close
            date.text = current.Date.toString()

        }
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): CurrencyValueHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.currency_value_row, viewGroup, false)

        return CurrencyValueHolder(v)
    }


    override fun onBindViewHolder(viewHolder: CurrencyValueHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val event = dataSet[position]
        viewHolder.bind(event)
    }

    fun setData(currency: Currency) {
        dataSet = currency.values as MutableList<CurrencyValue>
    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}