package com.example.arken.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

public class BaseFragment extends Fragment {
    private ImageButton eventPage;
    private ImageButton signOut;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_base, container, false);
        eventPage = view.findViewById(R.id.menu_event);
        eventPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Navigation.findNavController(view).navigate(R.id.action_eventListFragment_self);
            }
        });
        signOut = view.findViewById(R.id.menu_logout);
        signOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MainActivity.getClient().signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if(Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.eventListFragment)
                            Navigation.findNavController(signOut).navigate(R.id.action_baseFragment_to_startFragment);
                    }
                });
            }
        });
        return view;
    }
}
