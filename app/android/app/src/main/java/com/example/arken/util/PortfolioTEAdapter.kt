package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R

class PortfolioTEAdapter(
    var nameSet: List<String>, val teClickListener: TEClickListener?
) :
    RecyclerView.Adapter<PortfolioTEAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {

        val textView: TextView = v.findViewById(R.id.portfolio_TE)
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.item_te, viewGroup, false)

        return ViewHolder(v)
    }


    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        // Get element from your dataset at this position and replace the contents of the view
        // with that element

        viewHolder.textView.text = nameSet[position]
        viewHolder.itemView.setOnClickListener{
            teClickListener?.onTEClicked(position)
        }
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount(): Int {
        //profile
        return nameSet.size
    }

}
interface TEClickListener{
    fun onTEClicked(position : Int)
}
