package com.example.arken.fragment

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.Profile
import com.example.arken.util.CommentAdapter
import com.example.arken.util.OnCommentClickListener
import com.example.arken.util.OnItemClickListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import java.util.*

/*
    !) adapter falan koy argument commentleri al
    3) kendi commentimse update veya delete seçeneği
 */

class ListCommentFragment : Fragment(), CommentFragment.OnCommentSubmitted, OnCommentClickListener {

    private lateinit var recyclerView: RecyclerView
    private lateinit var dataset: MutableList<Comment>
    private lateinit var commentAdapter: CommentAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_comment_list,
            container, false
        ).apply { tag = TAG }

        recyclerView = rootView.findViewById(R.id.recyclerView)
        dataset = mutableListOf()
        val comment1 = Comment("vdvd", "dvdv", "bfb", Date(2019,6,2),"fhgg")
        val comment2 = Comment("vdvdfd", "dvdv", "bfbdvvddvvddv", Date(2019,6,2),"fhgg")
        dataset.add(comment1)
        dataset.add(comment2)
        val userId = activity!!.getSharedPreferences(LoginFragment.MY_PREFS_NAME, Context.MODE_PRIVATE
        ).getString("userId", "defaultId")!!

        commentAdapter = CommentAdapter(dataset, userId, this)
        recyclerView.adapter = commentAdapter

        Log.i("ListCommentFragment", "onCreateView")
        fragmentManager?.beginTransaction()?.add(R.id.fragment_make_comment, CommentFragment.newInstance(this), "comment")?.commit()
        return rootView
    }

    private fun setDataset(list: MutableList<Comment>) {
        //arguman alacaksın
        this.dataset = list
        recyclerView.adapter?.notifyDataSetChanged()
    }
    override fun onItemClicked(comment: Comment) {
        //update
        Log.i("cdfdfd", "cfv")
    }

    fun addToDataset(comment: Comment){
        dataset.add(0, comment)
    }
    override fun onSubmit(comment: Comment, textView: TextView) {
        addToDataset(comment)
        recyclerView.adapter?.notifyDataSetChanged()
    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        private val KEY_LAYOUT_MANAGER = "layoutManager"
        fun newInstance(list: MutableList<Comment>){
            val instance = ListCommentFragment()
            instance.setDataset(list)
        }
    }

}



