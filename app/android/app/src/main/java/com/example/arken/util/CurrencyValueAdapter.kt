package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.CurrencyValue

class CurrencyValueAdapter (

    var dataSet: MutableList<CurrencyValue>

) :
    RecyclerView.Adapter<CurrencyValueAdapter.CurrencyValueHolder>() {

    class CurrencyValueHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val value: TextView

        private val date: TextView


        init {

            value = v.findViewById(R.id.currencyRowValue)
            date= v.findViewById(R.id.currencyRowDate)
        }

        fun bind(current: CurrencyValue) {

            value.text = current.open
            date.text= current.Date.toString()

        }

    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): CurrencyValueHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.current_row, viewGroup, false)

        return CurrencyValueHolder(v)
    }


    override fun onBindViewHolder(viewHolder: CurrencyValueHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val event = dataSet[position]
        viewHolder.bind(event)
    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}