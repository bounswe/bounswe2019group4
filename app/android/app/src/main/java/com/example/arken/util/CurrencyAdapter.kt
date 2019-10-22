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

    /**
     * Provide a reference to the type of views that you are using (custom ViewHolder)
     */
    class CurrentHolder(v: View) : RecyclerView.ViewHolder(v) {
        val value: TextView
        val name: TextView

        val background: RelativeLayout

        init {
            // Define click listener for the ViewHolder's View.

            name = v.findViewById(R.id.current)
            value = v.findViewById(R.id.value)

            background = v.findViewById(R.id.current_row_background)
        }

        fun bind(current: Current, clickListener: OnCurrentClickListener) {
            name.text = current.from + "/" + current.to
            value.text = current.rate



            itemView.setOnClickListener {
                clickListener.onItemClicked()
            }
        }

    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): CurrentHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.current_row, viewGroup, false)

        return CurrentHolder(v)
    }


    override fun onBindViewHolder(viewHolder: CurrentHolder, position: Int) {
        Log.d(TAG, "Element $position set.")

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val event = dataSet[position]
        viewHolder.bind(event, itemClickListener)

    }


    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"


    }
}

interface OnCurrentClickListener {
    fun onItemClicked()
}