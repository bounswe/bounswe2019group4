package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.Current


class CurrencyAdapter(

    var dataSet: MutableList<Current>,
    val itemClickListener: OnCurrentClickListener
) :
    RecyclerView.Adapter<CurrencyAdapter.CurrentHolder>() {

    class CurrentHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val value: TextView
        private val name: TextView
        private val date: TextView
        private val background: RelativeLayout

        init {
            name = v.findViewById(R.id.current)
            value = v.findViewById(R.id.value)
            date = v.findViewById(R.id.currentDate)
            background = v.findViewById(R.id.current_row_background)
        }

        fun bind(current: Current, clickListener: OnCurrentClickListener) {
            name.text = current.from + "/" + current.to
            value.text = current.rate

            if (current.Date == null) {
                date.text = ""
            } else {
                date.text = current.Date.toString()
            }

            itemView.setOnClickListener {
                clickListener.onItemClicked(current.from)
            }
        }

    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): CurrentHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.current_row, viewGroup, false)

        return CurrentHolder(v)
    }


    override fun onBindViewHolder(viewHolder: CurrentHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val event = dataSet[position]
        viewHolder.bind(event, itemClickListener)
    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}

interface OnCurrentClickListener {
    fun onItemClicked(code: String)
}