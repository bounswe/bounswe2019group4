package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Event

class EventAdapter(var dataSet: List<Event>) :
    RecyclerView.Adapter<EventAdapter.ViewHolder>() {

    /**
     * Provide a reference to the type of views that you are using (custom ViewHolder)
     */
    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val textView: TextView
        val importanceStar1: ImageView
        val importanceStar2: ImageView
        val importanceStar3: ImageView
        val country: TextView
        val background: RelativeLayout

        init {
            // Define click listener for the ViewHolder's View.
            v.setOnClickListener { Log.d(TAG, "Element $adapterPosition clicked.") }
            textView = v.findViewById(R.id.textView)
            importanceStar1 = v.findViewById(R.id.event_star1_imageView)
            importanceStar2 = v.findViewById(R.id.event_star2_imageView)
            importanceStar3 = v.findViewById(R.id.event_star3_imageView)
            country = v.findViewById(R.id.country)
            background = v.findViewById(R.id.event_row_background)
        }
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.event_row, viewGroup, false)

        return ViewHolder(v)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        Log.d(TAG, "Element $position set.")

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        viewHolder.textView.text = dataSet[position].Event
        viewHolder.country.text = dataSet[position].Country
        when{
            (position % 3 == 0) -> {
                viewHolder.background.setBackgroundResource(R.color.colorPriBlue)
            }
            (position % 3 == 1) -> {
                viewHolder.background.setBackgroundResource(R.color.colorlightBlue)
            }
            (position % 3 == 2) -> {
                viewHolder.background.setBackgroundResource(R.color.colorDarkBlue)
            }
        }
        when {
            (dataSet[position].Importance).equals("1") -> {
                viewHolder.importanceStar1.setImageResource(R.drawable.ic_star_full)
                viewHolder.importanceStar2.setImageResource(R.drawable.ic_star_empty)
                viewHolder.importanceStar3.setImageResource(R.drawable.ic_star_empty)
            }
            (dataSet[position].Importance).equals("2") -> {
                viewHolder.importanceStar1.setImageResource(R.drawable.ic_star_full)
                viewHolder.importanceStar2.setImageResource(R.drawable.ic_star_full)
                viewHolder.importanceStar3.setImageResource(R.drawable.ic_star_empty)
            }
            (dataSet[position].Importance).equals("3") -> {
                viewHolder.importanceStar1.setImageResource(R.drawable.ic_star_full)
                viewHolder.importanceStar2.setImageResource(R.drawable.ic_star_full)
                viewHolder.importanceStar3.setImageResource(R.drawable.ic_star_full)
            }
        }

    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}