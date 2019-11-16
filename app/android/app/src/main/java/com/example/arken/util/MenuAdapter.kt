package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Event

class MenuAdapter(var imageSet: IntArray, var nameSet: Array<String>, val isLogged: Boolean, val itemClickListener: OnMenuItemClickListener) :
    RecyclerView.Adapter<MenuAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {

        val textView: TextView = v.findViewById(R.id.menu_text)
        val imageView: ImageView = v.findViewById(R.id.menu_image)
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.item_menu, viewGroup, false)

        return ViewHolder(v)
    }


    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        // Get element from your dataset at this position and replace the contents of the view
        // with that element

        viewHolder.imageView.setImageResource(imageSet[position])
        viewHolder.textView.text = nameSet[position]
        viewHolder.itemView.setOnClickListener {
            itemClickListener.onMenuItemClicked(position)
        }
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount():Int{
        return if(!isLogged)
            imageSet.size - 2
        else imageSet.size
    }

    companion object {
        private val TAG = "CustomAdapter"
    }
}

interface OnMenuItemClickListener {
    fun onMenuItemClicked(index: Int)
}