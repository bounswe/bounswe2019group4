package com.example.arken.util

import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.CurrencyValue
import com.example.arken.model.tradingEquipment.Current

class SingleCurrencyAdapter(var dataSet: MutableList<CurrencyValue>): RecyclerView.Adapter<SingleCurrencyAdapter.CurrencyValueHolder>() {

    class CurrencyValueHolder(v: View) : RecyclerView.ViewHolder(v) {


        init {

        }

        fun bind(current: Current, clickListener: OnCurrentClickListener) {



        }

    }


    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): SingleCurrencyAdapter.CurrencyValueHolder {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getItemCount(): Int {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onBindViewHolder(holder: SingleCurrencyAdapter.CurrencyValueHolder, position: Int) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}