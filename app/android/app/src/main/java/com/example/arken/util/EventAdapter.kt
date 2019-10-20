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
import com.example.arken.model.ListEvent
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EventAdapter(var dataSet: MutableList<Event>, val itemClickListener: OnItemClickListener) :
    RecyclerView.Adapter<EventAdapter.ViewHolder>() {
    var totalPages: Int = 1
    var page: Int = 1
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
            v.setOnClickListener {
                System.out.println("abbab")
                Log.d(TAG, "Element $adapterPosition clicked.")
            }
            textView = v.findViewById(R.id.textView)
            importanceStar1 = v.findViewById(R.id.event_star1_imageView)
            importanceStar2 = v.findViewById(R.id.event_star2_imageView)
            importanceStar3 = v.findViewById(R.id.event_star3_imageView)
            country = v.findViewById(R.id.country)
            background = v.findViewById(R.id.event_row_background)
        }

        fun bind(event: Event, clickListener: OnItemClickListener) {
            textView.text = event.Event
            country.text = event.Country

            when {
                (event.Importance).equals("1") -> {
                    importanceStar1.setImageResource(R.drawable.ic_star_full)
                    importanceStar2.setImageResource(R.drawable.ic_star_empty)
                    importanceStar3.setImageResource(R.drawable.ic_star_empty)
                }
                (event.Importance).equals("2") -> {
                    importanceStar1.setImageResource(R.drawable.ic_star_full)
                    importanceStar2.setImageResource(R.drawable.ic_star_full)
                    importanceStar3.setImageResource(R.drawable.ic_star_empty)
                }
                (event.Importance).equals("3") -> {
                    importanceStar1.setImageResource(R.drawable.ic_star_full)
                    importanceStar2.setImageResource(R.drawable.ic_star_full)
                    importanceStar3.setImageResource(R.drawable.ic_star_full)
                }
            }
            itemView.setOnClickListener {
                clickListener.onItemClicked(event)
            }
        }

    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.event_row, viewGroup, false)

        return ViewHolder(v)
    }

    fun newPage() {
        page += 1
        if (page <= totalPages) {
            val call: Call<ListEvent> = RetroClient.getInstance().apiService.getEventsAll(page, 10)
            call.enqueue(object : Callback<ListEvent> {
                override fun onResponse(call: Call<ListEvent>, response: Response<ListEvent>) {
                    if (response.isSuccessful) {
                        val listEvent: ListEvent? = response.body()
                        if (listEvent?.events != null) {
                            dataSet.addAll(listEvent.events!!)
                            notifyDataSetChanged()
                        }
                    }
                }

                override fun onFailure(call: Call<ListEvent>, t: Throwable) {
                }
            })
        }
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        Log.d(TAG, "Element $position set.")

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val event = dataSet[position]
        when {
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
        viewHolder.bind(event, itemClickListener)
        if (position == dataSet.size - 1) {
            newPage()
        }


    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"


    }
}

interface OnItemClickListener {
    fun onItemClicked(event: Event)
}